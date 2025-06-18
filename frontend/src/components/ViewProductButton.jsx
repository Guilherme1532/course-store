import React from 'react'
import { Link } from 'react-router-dom'

const ViewProductButton = ({ product }) => (
  <Link
    to={`/product/${product}`}
    state={{ product }}
    className={`flex justify-center items-center bg-gray-800 text-orange-600 hover:bg-gray-700 font-medium p-3 rounded`}
  >
    Ver curso
  </Link>
);

export default ViewProductButton