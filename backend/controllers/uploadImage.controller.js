import uploadImageCloudnary from "../utils/uploadImageCloudnary.js";

const uploadImageController = async (req, res) => {
  if(req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado",
      error: true,
      success: false,
    });
  }
  console.log("File received:", req.file);
  try {
    const file = req.file;
    const uploadImage = await uploadImageCloudnary(file);
    return res.status(200).json({
      message: "Imagem carregada com sucesso",
      data: uploadImage,
      error: false,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export default uploadImageController;
