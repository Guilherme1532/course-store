import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  cep: {
    type: String,
    required: true,
  },
  rua: {
    type: String,
    required: true,
  },
  numero: {
    type: String,
    required: true,
  },
  complemento: {
    type: String,
    default: "",
  },
  bairro: {
    type: String,
    required: true,
  },
  cidade: {
    type: String,
    required: true,
  },
  estado: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  }
}, {
  timestamps: true
});

const AddressModel = mongoose.model("address", addressSchema);

export default AddressModel;
  
