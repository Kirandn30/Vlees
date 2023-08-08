import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { db } from "../../config";
import {
  IProductType,
  setCategory,
  setProducts,
  setVariants,
  setStoreLocation,
  setLoading,
} from "../redux/ProductsSlice";
import { collection, getDocs, query, where, and } from "firebase/firestore";

export const loadData = async (
  locationId: string | null = null,
  dispatch: Dispatch<AnyAction>
) => {
  dispatch(setLoading(true));
  try {
    const storeLocation = await getDocs(
      query(collection(db, "Location"), where("active", "==", true))
    );
    dispatch(
      setStoreLocation(
        storeLocation.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      )
    );

    if (locationId) {
      const variants = await getDocs(
        query(
          collection(db, "Variant"),
          and(
            where("locationId", "==", locationId),
            where("is_active", "==", true)
          )
        )
      );
      dispatch(
        setVariants(variants.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );

      const productIds = variants.docs.map((doc) => doc.data().ProductId);
      console.log(locationId)
      console.log(productIds);
      const products = await getDocs(
        query(collection(db, "Product"), where("id", "in", productIds))
      );
      dispatch(
        setProducts(products.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
      );

      const categoryIds = products.docs.map((doc) => doc.data().categoryId);

      const categories = await getDocs(
        query(collection(db, "Catogory"), where("id", "in", categoryIds))
      );
      dispatch(
        setCategory(
          categories.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
        )
      );
    }
  } catch (e) {
    console.log(e);
  } finally {
    dispatch(setLoading(false));
  }
};
