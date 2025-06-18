import SubCategoryModel from "../models/subCategory.model.js";

export async function createSubcategoryController(req, res){
  if (req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado",
      error: true,
      success: false,
    });
  }
  try {
    const { name, image, category } = req.body;
    if (!name || !image || !category[0]) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
        success: false,
        error: true,
      });
    }
    const payload = {
      name,
      image,
      category
    };
    const createSubcategory = new SubCategoryModel(payload)
    const save = await createSubcategory.save()
    
    return res.status(200).json({
      message: "Subcategoria criada com sucesso!",
      success: true,
      error: false,
      data: save,
    });
  } catch (error) {
    
    return res.status(500).json({
      message: "Erro ao criar subcategoria!",
      success: false,
      error: error.message,
    });
  }
};

export async function getSubcategoryController(req, res) {
  try {
    const subcategory = await SubCategoryModel.find().sort({ createdAt: -1 }).populate("category");
    return res.status(200).json({
      message: "Subcategorias encontradas com sucesso!",
      success: true,
      error: false,
      data: subcategory,
    });
  } catch (error) {
    
    return res.status(500).json({
      message: "Erro ao encontrar subcategorias!",
      success: false,
      error: error.message,
    });
  }
}

export async function updateSubcategoryController(req, res) {
  if (req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado",
      error: true,
      success: false,
    });
  }
  try {
    
    const { _id, name, image, category } = req.body;
    if (!_id || !name || !image || !category[0]) {
      return res.status(400).json({
        message: "Todos os campos são obrigatórios",
        error: true,
        success: false,
      });
    }
    const subcategory = await SubCategoryModel.findByIdAndUpdate(
      _id,
      { name, image, category },
      { new: true }
    );
    if (!subcategory) {
      return res.status(400).json({
        message: "Erro ao atualizar categoria",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Categoria atualizada com sucesso",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar categoria", error });
  }
}

export async function deleteSubcategory(req, res) {
  if(req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado",
      error: true,
      success: false,
    });
  }
  try {
    const { _id } = req.body;
    
    await SubCategoryModel.findByIdAndDelete(_id);
    res.status(200).json({
      message: "Subcategoria deletada com sucesso",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao deletar categoria",
      error: false,
      success: false,
      data: error,
    });
  }
}