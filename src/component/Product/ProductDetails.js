import React, { Fragment, useEffect } from 'react'
import Carousel from "react-material-ui-carousel";
import "./ProductDetails.css";
import { useSelector, useDispatch} from "react-redux";
import { getProductDetails } from '../../actions/productAction';
import MetaData from "../layout/MetaData";

const ProductDetails = ({match = { params: {} }}) => {
    const dispatch = useDispatch();

    const {product,loading,err} = useSelector(state=>state.productDetails)

    useEffect(() => {
        dispatch(getProductDetails(match.params.id))
    }, [dispatch, match.params.id]);

    if (!product) {
        return <h1>Product not found</h1>
    }

    return (
        <Fragment>
            <div className='ProductDetails'>
                <div>
                    {product && product.images && (
                        <Carousel>
                            {product.images.map((item, i) => (
                                <img
                                    className="CarouselImage"
                                    key={item.url}
                                    src={item.url}
                                    alt={`${i} Slide`}
                                />
                            ))}
                        </Carousel>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

export default ProductDetails;
;
  