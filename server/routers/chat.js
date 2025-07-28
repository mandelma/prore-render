const router = require('express').Router();

const { RtcTokenBuilder, RtcRole } = require("agora-access-token");

router.get("/:tokenType", (req, res) => {
    //res.json({name: 'mama'})
    const currentTimeStamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs =
        //currentTimeStamp + Number(process.env.EXPIRATION_TIME_IN_SECONDS);
        currentTimeStamp + Number(1000);

    const { channelName, user } = req.query;

    if (!channelName) {
        return res.status(400).json({ error: "Channel name is required" }).send();
    }

    const tokenType = req.params.tokenType;

    if (!tokenType) {
        return res.status(400).json({ error: "token type is required" }).send();
    }

    if (tokenType === "uid") {
        const key = RtcTokenBuilder.buildTokenWithUid(
            //process.env.API_ID,
            '6d18a78587044be0843207303757c771',
            //process.env.API_CERTIFICATE,
            '5b7dda3223d541b191f7df554a750600',
            channelName,
            Number(user),
            RtcRole.PUBLISHER,
            privilegeExpiredTs
        );
        return res
            //.json({ key, expireInSeconds: process.env.EXPIRATION_TIME_IN_SECONDS })
            .json({ key, expireInSeconds: 1000 })
            .send();
    } else if (tokenType === "account") {
        const key = RtcTokenBuilder.buildTokenWithAccount(
            //process.env.API_ID,
            '6d18a78587044be0843207303757c771',
            //process.env.API_CERTIFICATE,
            '5b7dda3223d541b191f7df554a750600',
            channelName,
            user,
            RtcRole.PUBLISHER,
            privilegeExpiredTs
        );
        return res
            // .json({ key, expireInSeconds: process.env.EXPIRATION_TIME_IN_SECONDS })
            // .send();
            .json({ key, expireInSeconds: 1000 })
            .send();
    } else {
        return res.status(400).json({ error: "Invalid token type" }).send();
    }
});

module.exports = router
