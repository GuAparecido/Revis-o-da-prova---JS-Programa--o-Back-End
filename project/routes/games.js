const express = require("express");

const router = express.Router();
const z = require("zod");
const { findGames, saveGame } = require("../db/game");
const { auth } = require("../middleware/auth");

const GameSchema = z.object({
    name: z.string(),
    platform: z.string(),
    description: z.string().optional(),
})

router.get("/games", auth, async (req, res) => {
    const games = await findGames(req.user);
    res.json({ games });
});

router.post("/game", auth, async (req, res) => {
    try {
        console.log(req.user);
        const { name, description, platform } = GameSchema.parse(req.body);
        const game = await saveGame(name, description, platform, req.user);
        res.json({ game })
    } catch (error) {
        console.log(error);
        if (error instanceof z.ZodError) res.status(400).json(error);
        res.status(500).send();
    }
});



module.exports = {
    router
}