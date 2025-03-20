import React, { useState, useEffect } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import useFetchData from "../../../query/useFetchData";
import {
  Card,
  CardBody,
  CardHeader,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Select,
  Skeleton,
  Spinner,
} from "@chakra-ui/react";
import api from "../../../services/api";
import {
  ChevronDownCircle,
  ChevronUpCircle,
  Star,
  WifiOff,
} from "lucide-react";

function AnalyticsPage() {
  const [selectedCategoryState, setSelectedCategoryState] = useState("beauty");
  const [categories, setCategories] = useState([]);
  const [categoryTotal, setCategoryTotal] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const average = (arr) => {
    const operator = arr.reduce((a, b) => a + b);
    const divide = operator / arr.length;
    return divide.toFixed(1);
  };

  const {
    data: categoryPriceData,
    isLoading: categoryPriceIsLoading,
    isError: categoryPriceIsError,
    error: categoryPriceError,
  } = useFetchData(`/products/category/${selectedCategoryState}`, {
    sortBy: "price",
    order: "desc",
  });

  const {
    data: categoryRatingData,
    isLoading: categoryRatingIsLoading,
    isError: categoryRatingIsError,
    error: categoryRatingError,
  } = useFetchData(`/products/category/${selectedCategoryState}`, {
    sortBy: "rating",
    order: "desc",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await api.get("/products/categories");
        const categoriesData = categoriesResponse.data;
        setCategories(categoriesData);
        fetchAllCategoryProducts(categoriesData);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchAllCategoryProducts = async (categoriesData) => {
      try {
        const requests = categoriesData.map((category) => {
          return axios
            .get(`${category.url}`)
            .then((response) => ({
              categorySlug: category.slug,
              products: response.data,
            }))
            .catch((error) => ({
              categorySlug: category.slug,
              error: error.message,
            }));
        });

        const responses = await Promise.all(requests);
        const totalMap = responses.map((item) => {
          return {
            slug: item.categorySlug,
            total: item.products.total,
          };
        });
        setCategoryTotal(totalMap);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading)
    return (
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </div>
    );

  if (
    error ||
    categoryPriceIsError ||
    categoryPriceError ||
    categoryRatingError
  )
    return (
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        <WifiOff />
        error
      </div>
    );

  return (
    <div className="w-[90vw] mx-auto grid grid-cols-1 gap-4 mt-6">
      <Card>
        <CardHeader>
          <p className="text-xl font-semibold">Total Products by Categories</p>
        </CardHeader>
        <CardBody>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryTotal}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="slug" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1">
        <Card>
          <CardHeader>
            <p className="text-xl font-semibold">Product Analytics</p>
          </CardHeader>
          <CardBody className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-1 gap-2">
              <p className="font-semibold">Select Producs Category</p>
              <Select
                placeholder="Select option"
                onChange={(e) => setSelectedCategoryState(e.target.value)}
              >
                {categories.map((item, index) => {
                  return <option value={item.slug}>{item.name}</option>;
                })}
              </Select>
            </div>
            {categoryPriceIsLoading || categoryRatingIsLoading ? (
              <>
                <Skeleton height="300px" />
                <Skeleton height="300px" />
              </>
            ) : (
              <>
                <p className="text-xl font-semibold">Price Analytic</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Card>
                    <CardBody>
                      <Stat size="md">
                        <StatLabel>
                          Average {selectedCategoryState}'s price
                        </StatLabel>
                        <StatNumber>
                          $
                          {average(
                            categoryPriceData.products.map((item) => item.price)
                          )}
                        </StatNumber>
                        <StatHelpText>
                          {categoryPriceData.products.length} products
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  <div className="flex flex-col gap-2">
                    <Card className="h-1/2">
                      <CardHeader>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex gap-2 items-center">
                            <ChevronUpCircle />
                            <p className="text-lg font-semibold ">
                              {categoryPriceData.products[0].title}
                            </p>
                          </div>
                          <p className="text-xl">
                            ${categoryPriceData.products[0].price}
                          </p>
                        </div>
                        <p>Highest Price</p>
                      </CardHeader>
                    </Card>
                    <Card className="h-1/2">
                      <CardHeader>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex gap-2 items-center">
                            <ChevronDownCircle />
                            <p className="text-lg font-semibold ">
                              {
                                categoryPriceData.products[
                                  categoryPriceData.products.length - 1
                                ].title
                              }
                            </p>
                          </div>
                          <p className="text-xl">
                            $
                            {
                              categoryPriceData.products[
                                categoryPriceData.products.length - 1
                              ].price
                            }
                          </p>
                        </div>
                        <p>Lowest Price</p>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryPriceData.products}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="price" fill="#41644A" />
                  </BarChart>
                </ResponsiveContainer>
                <p className="text-xl font-semibold">Rating Analytic</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Card>
                    <CardBody>
                      <Stat size="md">
                        <StatLabel>
                          Average {selectedCategoryState}'s rating
                        </StatLabel>
                        <StatNumber>
                          <div className="flex items-center gap-2">
                            <Star color="orange" />
                            {average(
                              categoryRatingData.products.map(
                                (item) => item.rating
                              )
                            )}
                          </div>
                        </StatNumber>
                        <StatHelpText>
                          {categoryRatingData.products.length} products
                        </StatHelpText>
                      </Stat>
                    </CardBody>
                  </Card>
                  
                  <div className="flex flex-col gap-2">
                    <Card className="h-1/2">
                      <CardHeader>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex gap-2 items-center">
                            <ChevronUpCircle />
                            <p className="text-lg font-semibold ">
                              {categoryRatingData.products[0].title}
                            </p>
                          </div>
                          <p className="text-xl">
                            {categoryRatingData.products[0].rating}
                          </p>
                        </div>
                        <p>Highest Rating</p>
                      </CardHeader>
                    </Card>
                    <Card className="h-1/2">
                      <CardHeader>
                        <div className="flex justify-between items-center gap-2">
                          <div className="flex gap-2 items-center">
                            <ChevronDownCircle />
                            <p className="text-lg font-semibold ">
                              {
                                categoryRatingData.products[
                                  categoryRatingData.products.length - 1
                                ].title
                              }
                            </p>
                          </div>
                          <p className="text-xl">
                            {
                              categoryRatingData.products[
                                categoryRatingData.products.length - 1
                              ].rating
                            }
                          </p>
                        </div>
                        <p>Lowest Rating</p>
                      </CardHeader>
                    </Card>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryRatingData.products}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="rating" fill="#EC5228" />
                  </BarChart>
                </ResponsiveContainer>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default AnalyticsPage;
