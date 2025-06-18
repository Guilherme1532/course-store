import ProductModel from "../models/product.model.js";

export async function createProduct(req, res) {
  if (req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado",
      error: true,
      success: false,
    });
  }
  try {
    const {
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !name ||
      !image ||
      !category ||
      !subCategory ||
      !unit ||
      !stock ||
      !price ||
      !discount ||
      !description
    ) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Todos os campos são obrigatórios",
      });
    }
    const newProduct = new ProductModel({
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    });
    const savedProduct = await newProduct.save();
    return res.status(201).json({
      success: true,
      message: "Produto criado com sucesso",
      data: savedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Erro ao criar produto",
    });
  }
}

export async function getProductController(req, res) {
  try {
    let { page, limit, search } = req.body;
    if (!page) page = 1;
    if (!limit) limit = 10;
    const query = search
      ? {
          $text: {
            $search: search,
          },
        }
      : {};

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      ProductModel.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category subCategory"),
      ProductModel.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Produtos encontrados com sucesso",
      error: false,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Erro ao buscar produtos",
    });
  }
}

export async function updateProduct(req, res) {
  if (req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado",
      error: true,
      success: false,
    });
  }
  try {
    const {
      _id,
      name,
      image,
      category,
      subCategory,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
    } = req.body;

    if (
      !_id ||
      !name ||
      !image ||
      !category ||
      !subCategory ||
      !unit ||
      !stock ||
      !price ||
      !discount ||
      !description ||
      !more_details
    ) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Todos os campos são obrigatórios",
      });
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      _id,
      {
        name,
        image,
        category,
        subCategory,
        unit,
        stock,
        price,
        discount,
        description,
        more_details,
      },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Produto atualizado com sucesso",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Erro ao atualizar produto",
    });
  }
}

export async function deleteProduct(req, res) {
  if (req.role !== "ADMIN") {
    return res.status(403).json({
      message: "Acesso negado",
      error: true,
      success: false,
    });
  }
  try {
    const { _id } = req.body;
    if (!_id) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "ID do produto é obrigatório",
      });
    }
    await ProductModel.findByIdAndDelete(_id);
    return res.status(200).json({
      success: true,
      message: "Produto deletado com sucesso",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Erro ao deletar produto",
    });
  }
}

export async function getProductsByCategory(req, res) {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "ID da categoria é obrigatório",
      });
    }
    const products = await ProductModel.find({ category: categoryId })
      .populate("category subCategory")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Produtos encontrados com sucesso",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Erro ao buscar produtos por categoria",
    });
  }
}

export async function getProductById(req, res) {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "ID do produto é obrigatório",
      });
    }
    const product = await ProductModel.findByIdAndUpdate(
      productId,
      { $inc: { views: 1 } }, // Incrementa o campo "views"
      { new: true } // Retorna o documento atualizado
    ).populate("category subCategory");

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Produto não encontrado",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Produto encontrado com sucesso",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Erro ao buscar produto por ID",
    });
  }
}

export async function getMostViewedProducts(req, res) {
  try {
    const { limit = 10 } = req.query; // Permite definir um limite opcional (padrão: 10)

    // Busca os produtos mais acessados, ordenados por "views" em ordem decrescente
    const products = await ProductModel.find()
      .sort({ views: -1 }) // Ordena pelo campo "views" em ordem decrescente
      .limit(Number(limit)) // Limita o número de resultados
      .populate("category subCategory");

    return res.status(200).json({
      success: true,
      message: "Produtos mais acessados encontrados com sucesso",
      data: products,
    });
  } catch (error) {
    console.error("Erro ao buscar produtos mais acessados:", error);
    return res.status(500).json({
      success: false,
      error: true,
      message: "Erro ao buscar produtos mais acessados",
    });
  }
}