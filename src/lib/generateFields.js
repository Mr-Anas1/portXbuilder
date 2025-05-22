export async function generateFields({ name, age, experience, profession }) {
  if (!name || !age || !experience || !profession) {
    throw new Error("Missing required fields for generating AI fields.");
  }

  const prompt = `
You're creating personal portfolio content for a ${profession}. All content should sound human, modern, and confident — written like it's from the user, not about them.

Use the following info:
- Name: ${name}
- Age: ${age}
- Experience: ${experience} years
- Profession: ${profession}

Generate a JSON object with:
{
  "home_title": "A short, catchy tagline about what the user does (max 6 words). No names or job titles. Think personal brand or vibe, e.g., 'Designing for Amazing People' or 'Solving Problems with Precision'.",
  "home_subtitle": "A confident one-liner where the user introduces themselves casually. E.g., 'I'm a passionate ${profession} building clean web experiences.'",
  "about_me": "A short paragraph in first person (3-4 lines) where the user shares who they are, their experience, and what excites them about their profession. Keep it friendly and natural.",
  "skills": ["List of 4-6 top skills relevant to the profession"]
}

Only return valid JSON. Do not include markdown or extra explanation.
`;

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await res.json();
    console.log("Full Gemini API Response:", JSON.stringify(data, null, 2)); // More detailed logging

    // Safety check
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error("Gemini API response is missing expected content.");
    }

    const responseText = data.candidates[0].content.parts[0].text;
    console.log("Raw AI response:", responseText);

    const jsonMatch = responseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("Failed to find JSON in the AI response.");
    }

    const result = JSON.parse(jsonMatch[0]);
    return result;
  } catch (err) {
    console.error("Error generating fields:", err.message);
    return null;
  }
}
