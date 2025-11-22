const axios = require('axios');
const { JSDOM } = require('jsdom');

async function parseTikTokPost(idOrUrl) {
    const startTime = Date.now();
    let url = idOrUrl;

    try {
        // Xử lý URL rút gọn vt.tiktok.com hoặc vm.tiktok.com
        if (idOrUrl.includes('vt.tiktok.com') || idOrUrl.includes('vm.tiktok.com')) {
            const response = await axios.get(idOrUrl, {
                maxRedirects: 5,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                }
            });
            url = response.request.res.responseUrl;
        } else if (!idOrUrl.includes('tiktok.com')) {
            // Nếu chỉ là ID
            url = `https://www.tiktok.com/@user/video/${idOrUrl}`;
        }

        // Fetch trang TikTok
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.106 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
            }
        });

        // Parse HTML với JSDOM
        const dom = new JSDOM(response.data);
        const document = dom.window.document;
        
        const scriptElement = document.querySelector('script#__UNIVERSAL_DATA_FOR_REHYDRATION__');
        
        if (!scriptElement) {
            return { error: 'Data not found' };
        }

        const jsonData = JSON.parse(scriptElement.textContent);
        const postData = jsonData['__DEFAULT_SCOPE__']['webapp.video-detail']['itemInfo']['itemStruct'];

        // Tìm video có độ phân giải cao nhất
        let bestBitrateInfo = null;
        let maxResolution = 0;

        if (postData.video && postData.video.bitrateInfo) {
            for (const bitrateInfo of postData.video.bitrateInfo) {
                const resolution = bitrateInfo.PlayAddr.Width * bitrateInfo.PlayAddr.Height;
                if (resolution > maxResolution) {
                    maxResolution = resolution;
                    bestBitrateInfo = bitrateInfo;
                }
            }
        }

        const bestPlayAddr = bestBitrateInfo ? bestBitrateInfo.PlayAddr : null;

        // Format dữ liệu trả về
        const parsedPostData = {
            status: 'success',
            processed_time: ((Date.now() - startTime) / 1000).toFixed(4),
            data: {
                id: postData.id,
                region: postData.locationCreated,
                title: postData.desc,
                cover: postData.video.cover,
                duration: postData.video.duration,
                play: {
                    DataSize: bestPlayAddr?.DataSize || '',
                    Width: bestPlayAddr?.Width || 0,
                    Height: bestPlayAddr?.Height || 0,
                    Uri: bestPlayAddr?.Uri || '',
                    UrlList: bestPlayAddr?.UrlList || [],
                    UrlKey: bestPlayAddr?.UrlKey || '',
                    FileHash: bestPlayAddr?.FileHash || '',
                    FileCs: bestPlayAddr?.FileCs || '',
                },
                music_info: {
                    id: postData.music.id,
                    title: postData.music.title,
                    playUrl: postData.music.playUrl,
                    cover: postData.music.coverLarge,
                    author: postData.music.authorName,
                    original: postData.music.original,
                    duration: postData.music.preciseDuration?.preciseDuration || postData.music.duration,
                },
                create_time: postData.createTime,
                stats: postData.stats,
                author: {
                    id: postData.author.id,
                    uniqueId: postData.author.uniqueId,
                    nickname: postData.author.nickname,
                    avatarLarger: postData.author.avatarLarger,
                    signature: postData.author.signature,
                    verified: postData.author.verified,
                },
                diversificationLabels: postData.diversificationLabels || [],
                suggestedWords: postData.suggestedWords || [],
                contents: postData.contents?.map(content => ({
                    textExtra: content.textExtra?.map(extra => ({
                        hashtagName: extra.hashtagName
                    })) || []
                })) || []
            }
        };

        return parsedPostData;

    } catch (error) {
        console.error('Error:', error.message);
        return { 
            error: 'Unable to fetch the page',
            message: error.message 
        };
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const url = req.query.url || req.body?.url || '';

    if (!url) {
        return res.status(400).json({
            error: 'Vui lòng cung cấp URL video cần tải bằng cách thêm tham số "?url=" vào URL của trang.'
        });
    }

    try {
        const result = await parseTikTokPost(url);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
