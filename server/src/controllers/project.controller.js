import Project from "../models/project.model.js";

// Officer 1: Naya project banane ke liye
export const createProject = async (req, res) => {
  try {
    // 1. User se naye project ka title lo
    const { title } = req.body;

    // 2. YEH HAI ASLI JAADU: User ki ID kahan se aayi?
    // Yaad hai, hamare bouncer (authMiddleware) ne request ke upar ek sticker laga diya tha?
    // Yeh wahi sticker hai. Humein pata hai ki yeh request kis user ne bheji hai.
    const ownerId = req.user.id;

    // 3. Ek naya project banao, jismein title aur owner ki ID ho
    const newProject = new Project({
      title,
      owner: ownerId,
    });

    // 4. Naye project ko database mein save karo
    const savedProject = await newProject.save();

    // 5. Naya project response mein wapas bhej do
    res.status(201).json(savedProject);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Server error while creating project." });
  }
};

// Officer 2: Logged-in user ke saare projects laane ke liye
export const getProjects = async (req, res) => {
  try {
    // 1. Phir se, bouncer se user ki ID nikaalo
    const userId = req.user.id;

    // 2. Database mein jao aur woh saare projects dhoondho jinka 'owner'
    // is user ki ID se match karta hai.
    const projects = await Project.find({ owner: userId }).sort({
      createdAt: -1,
    }); // Naye waale sabse upar

    // 3. Projects ki list response mein wapas bhej do
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Server error while fetching projects." });
  }
};
