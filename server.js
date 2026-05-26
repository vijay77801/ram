const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

app.post("/login", async (req, res) => {

    try {

        const { studentname, password, branch } = req.body;

        if (!studentname || !password || !branch) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        const { data, error } = await supabase
            .from("students")
            .select("*")
            .eq("studentname", studentname)
            .eq("password", password)
            .eq("branch", branch);

        if (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

        if (data.length > 0) {

            return res.json({
                success: true,
                message: "Login Successful"
            });

        } else {

            return res.json({
                success: false,
                message: "Invalid Credentials"
            });

        }

    } catch (err) {

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server Running On Port ${PORT}`);
});
