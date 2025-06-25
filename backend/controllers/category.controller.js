import CategoryModel from "../models/category.model.js";

export async function createCategory(req, res) {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({
        message: "Nome e imagem são obrigatórios",
        error: true,
        success: false,
      });
    }
    const addCategory = new CategoryModel({
      name,
      image,
    });

    const saveCategory = await addCategory.save();
    if (!saveCategory) {
      return res.status(400).json({
        message: "Erro ao salvar categoria",
        error: true,
        success: false,
      });
    }
    return res.status(200).json({
      message: "Categoria criada com sucesso",
      error: false,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao criar categoria", error });
  }
}

export async function getCategories(req, res) {
  try {
    const categories = await CategoryModel.find();
    
    res.status(200).json({
      message: "Categorias obtidas com sucesso",
      error: false,
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao obter categorias", error });
  }
}

export async function deleteCategory(req, res) {
  
  try {
    const { _id } = req.body;
    
    await CategoryModel.findByIdAndDelete(_id);
    res.status(200).json({
      message: "Categoria deletada com sucesso",
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

export async function updateCategory(req, res) {
  try {
    const { _id, name, image } = req.body;
    if (!_id) {
      return res.status(400).json({
        message: "ID da categoria é obrigatório",
        error: true,
        success: false,
      });
    }
    const category = await CategoryModel.findByIdAndUpdate(
      _id,
      { name, image },
      { new: true }
    );
    if (!category) {
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
