import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  // 1. Pass kahan hai? Request ke headers mein.
  // Hum expect kar rahe hain ki frontend 'x-auth-token' naam ke header mein token bhejega.
  const token = req.header("x-auth-token");

  // 2. Agar pass hai hi nahi, toh wahin se bhaga do.
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  // 3. Agar pass hai, toh check karo ki asli hai ya nakli.
  try {
    // jwt.verify() token ko hamare JWT_SECRET se decode karne ki koshish karta hai.
    // Agar token nakli hai ya badal diya gaya hai, toh yeh error de dega.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. SABSE ZAROORI KAAM:
    // Agar token asli hai, toh uske andar se user ki ID nikalo aur
    // usko request object (req) mein daal do.
    // Isse aage aane waale controller ko pata chal jaayega ki yeh request kis user ne bheji hai.
    req.user = decoded.user;

    // 5. Ab jab sab theek hai, toh request ko aage controller ke paas jaane do.
    next();
  } catch (err) {
    // Agar token nakli (invalid) nikla, toh yahan se bhaga do.
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
