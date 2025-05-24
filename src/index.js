import { Rettiwt } from "rettiwt-api";
import { AttachmentBuilder, EmbedBuilder, FileBuilder, MessageFlags, SeparatorBuilder, TextDisplayBuilder, WebhookClient } from "discord.js";
import got from 'got'
import 'dotenv/config'

const RETTIWT_API_KEY = process.env.RETTIWT_API_KEY;
const DISCORD_HOOK_URL = process.env.DISCORD_HOOK;

const webhookClient = new WebhookClient({
    id: process.env.DISCORD_HOOK_ID,
    token: process.env.DISCORD_HOOK_TOKEN
})
const rettiwt = new Rettiwt({ apiKey: RETTIWT_API_KEY });
const pj_sekai_id = "1158668053183266816"

setInterval(() => {
    rettiwt.user.timeline(pj_sekai_id)
    .then(res => {
            const query_time = Date.now()
            let recent_tweets = []
            for (const tweet of res.list.splice(1)) {
                const diffs = query_time - Date.parse(tweet.createdAt)
                if (Math.floor(diffs/1000) > 60) break
                recent_tweets.push(tweet)
            }
            console.log(`${query_time}: new ${recent_tweets.length} tweets`)
            for (const tweet of recent_tweets.reverse()) {
                try {
                    webhookClient.send({
                        username: tweet.tweetBy.userName,
                        avatarURL: tweet.tweetBy.profileImage,
                        content: `[${tweet.retweetedTweet ? ("Retweeted @" + tweet.retweetedTweet.tweetBy.userName): "Tweet"}](https://fixupx.com/${tweet.tweetBy.id}/status/${tweet.id})`,
                    })
                } catch (err) {
                    console.error(`Failed to post tweet ${tweet.id} because of ${err.message}`)
                }
            }
        })
}, 60_000) // update every 60 seconds
