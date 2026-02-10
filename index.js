
import express from "express";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(express.json());

const EMAIL = "shruti2369.be23@chitkara.edu.in";

app.get("/health", (req, res) => {
  res.json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;
    const key = Object.keys(body)[0];
    let result;

    if (key === "fibonacci") {
      let n = body[key];
      let arr = [0, 1];
      for (let i = 2; i < n; i++) {
        arr.push(arr[i - 1] + arr[i - 2]);
      }
      result = arr.slice(0, n);
    }

    else if (key === "prime") {
      let nums = body[key];
      result = nums.filter(n => {
        if (n < 2) return false;
        for (let i = 2; i * i <= n; i++) {
          if (n % i === 0) return false;
        }
        return true;
      });
    }

    else if (key === "lcm") {
      let nums = body[key];
      let gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      let lcm = (a, b) => (a * b) / gcd(a, b);
      result = nums.reduce((a, b) => lcm(a, b));
    }

    else if (key === "hcf") {
      let nums = body[key];
      let gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
      result = nums.reduce((a, b) => gcd(a, b));
    }

    else if (key === "AI") {
      const aiRes = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [{ parts: [{ text: body[key] }] }]
        }
      );

      result = aiRes.data.candidates[0].content.parts[0].text
        .split(" ")[0]
        .replace(/[^a-zA-Z]/g, "");
    }

    else {
      return res.status(400).json({ is_success: false });
    }

    res.json({
      is_success: true,
      official_email: EMAIL,
      data: result
    });

  } catch {
    res.status(500).json({ is_success: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
