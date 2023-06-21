import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { Button, Card, Drawer, Icon, Image, Divider } from "native-base";
import Carousel from "react-native-snap-carousel";
import VarientsCard from "./VarientsCard";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux";
import { addItems, removeItems } from "../redux/CartSlice";
import { Entypo } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import AnimatedDotsCarousel from "react-native-animated-dots-carousel";

const ProductCard = ({
  product,
  navigate,
}: {
  product: IProductType;
  navigate: NavigationProp<ReactNavigation.RootParamList>;
}) => {
  const { items } = useSelector((state: RootState) => state.Cart);
  const { Products } = useSelector((state: RootState) => state.Listings);
  const deviceWidth = Dimensions.get("window").width;
  const [drawer, setDrawer] = useState(false);
  const dispatch = useDispatch();
  const [index, setIndex] = React.useState<number>(0);

  return (
    <Pressable
      onPress={() => {
        //@ts-ignore
        navigate.navigate("ProductPage", { productId: product.id });
      }}
    >
      <View className="flex">
        <View className="flex-row mx-1 mb-1 rounded-md bg-white p-1 justify-center items-center ">
          <View className="p-3">
            {product.variantes.length === 1 ? (
              <View className="flex flex-row justify-between m-3">
                <View>
                  <View className="space-y-1">
                    <Text
                      numberOfLines={2}
                      className="text-base font-semibold w-44"
                    >
                      {product.name}
                    </Text>
                    <Text
                      numberOfLines={2}
                      className=" font-semibold w-44 text-sm"
                    >
                      {product.variantes[0].name}
                    </Text>
                  </View>

                  <View className="flex-row justify-between mt-2">
                    <View>
                      <View>
                        <Text className="font-semibold text-[16px]">
                          ₹{product.variantes[0].discountedPrice}{" "}
                          <Text className="text-gray-400 line-through text-[14px]">
                            ₹{product.variantes[0].originalPrice}
                          </Text>
                        </Text>
                        <Text className="text-xs text-gray-500 w-40 mt-2">
                          {product.caption}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View>
                  <View className="flex -mb-5">
                    <Image
                      source={{ uri: product.image_url[0] }}
                      alt={product.name}
                      style={{
                        width: deviceWidth / 2.5,
                        height: deviceWidth / 3,
                        borderRadius: 5,
                      }}
                      className=""
                    />
                    <View className="relative m-0 self-center -translate-y-5 ">
                      {Boolean(
                        items.find(
                          (a) =>
                            a.selectedVariant.id === product.variantes[0].id
                        )
                      ) ? (
                        <View className="flex flex-row items-center p-1 gap-x-2  pr-3 bg-[#faf6f2]   border border-rose-500 rounded-lg">
                          <Pressable
                            onPress={() => {
                              const targetProduct = Products.find(
                                (items) =>
                                  items.id === product.variantes[0].ProductId
                              );
                              console.log(
                                targetProduct,
                                product.variantes[0].ProductId
                              );
                              const copyProduct = { ...targetProduct };
                              delete copyProduct.variantes;
                              dispatch(
                                removeItems({
                                  product: copyProduct,
                                  quantity: 1,
                                  selectedVariant: product.variantes[0],
                                })
                              );
                            }}
                          >
                            <Icon
                              as={<Entypo name="minus" />}
                              size="md"
                              color="black"
                            />
                          </Pressable>
                          <Text className="font-extrabold text-xl">
                            {
                              items.find(
                                (a) =>
                                  a.selectedVariant.id ===
                                  product.variantes[0].id
                              )?.quantity
                            }
                          </Text>
                          <Pressable
                            onPress={() => {
                              const targetProduct = Products.find(
                                (items) =>
                                  items.id === product.variantes[0].ProductId
                              );
                              const copyProduct = { ...targetProduct };
                              delete copyProduct.variantes;
                              dispatch(
                                addItems({
                                  product: copyProduct,
                                  quantity: 1,
                                  selectedVariant: product.variantes[0],
                                })
                              );
                            }}
                          >
                            <Icon
                              as={<Entypo name="plus" />}
                              size="md"
                              color="black"
                            />
                          </Pressable>
                        </View>
                      ) : (
                        <Button
                          className="bg-[#faf6f2] border border-rose-500 rounded-lg"
                          size="xs"
                          onPress={() => {
                            const targetProduct = Products.find(
                              (items) =>
                                items.id === product.variantes[0].ProductId
                            );
                            const copyProduct = { ...targetProduct };
                            delete copyProduct.variantes;
                            dispatch(
                              addItems({
                                product: copyProduct,
                                quantity: 1,
                                selectedVariant: product.variantes[0],
                              })
                            );
                          }}
                        >
                          <Text className="font-semibold px-3 text-[#B9181DFF]">
                            ADD
                          </Text>
                        </Button>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View className="flex flex-row justify-between m-3">
                <View className="space-y-1">
                  <Text
                    numberOfLines={2}
                    className="text-base font-semibold w-44"
                  >
                    {product.name}
                  </Text>
                  <Text className="font-semibold text-[12px] ">
                    Starting @{" "}
                    <Text className="text-[14px]">
                      ₹{product.variantes[0].discountedPrice}{" "}
                    </Text>
                    <Text className="line-through text-gray-500">
                      ₹{product.variantes[0].originalPrice}
                    </Text>
                  </Text>
                  <Text className="text-xs text-gray-500 w-40 pt-[10px]">
                    {product.caption}
                  </Text>
                </View>
                <View className="flex -mb-5">
                  <Image
                    source={{ uri: product.image_url[0] }}
                    alt={product.name}
                    style={{
                      width: deviceWidth / 2.5,
                      height: deviceWidth / 3,
                      borderRadius: 5,
                    }}
                    className=""
                  />
                  <View className="relative m-0 self-center -translate-y-5 ">
                    <Button
                      size="xs"
                      variant="outline"
                      onPress={() => setDrawer(true)}
                      style={{
                        borderColor: "#B9181DFF",
                        backgroundColor: "#faf6f2",
                        borderWidth: 0.3,
                      }}
                    >
                      <Text className="font-semibold text-[#B9181DFF]">
                        {product.variantes.length} Options
                      </Text>
                    </Button>
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>
        <Drawer
          isOpen={drawer}
          children={
            <VarientsCard variantes={product.variantes} setDrawer={setDrawer} />
          }
          onClose={() => setDrawer(false)}
          key={product.id}
          placement="bottom"
        />
      </View>
    </Pressable>
  );
};

export default ProductCard;
