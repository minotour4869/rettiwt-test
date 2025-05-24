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

rettiwt.user.timeline(pj_sekai_id)
.then(res => {
    for (const tweet of res.list.splice(1)) {
        console.log(`[${tweet.retweetedTweet ? ("Retweeted @" + tweet.retweetedTweet.tweetBy.userName) : "Tweeted"}](https://fixupx.com/${tweet.tweetBy.id}/status/${tweet.id})`)
    }
})
