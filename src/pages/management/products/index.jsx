import { useState, useEffect } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronFirst,
  ChevronLast,
  ChevronUp,
  Pen,
  Plus,
  Trash,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Image,
  Input,
  Skeleton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Badge,
  useToast,
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import useFetchData from "../../../query/useFetchData";
import "./products.css";

const sortValue = ["title", "price", "rating"];

function ProductsPage() {
  const Toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: createIsOpen,
    onOpen: createOnOpen,
    onClose: createOnClose,
  } = useDisclosure();
  const [createIsLoading, setCreateIsLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dataState, setDataState] = useState([]);
  const [dataPerPage, setDataPerPage] = useState(10);
  const [totalData, setTotalData] = useState(0);
  const [pageSkip, setPageSkip] = useState(0);
  const [selectedPage, setSelectedPage] = useState(0);
  const [selectedSearchFilterValue, setSelectedSearchFilterValue] =
    useState("");
  const [selectedSearchOrderValue, setSelectedSearchOrderValue] =
    useState(true);
  const [selectedEditValue, setSelectedEditValue] = useState({
    id: 0,
    name: "",
    price: 0,
  });
  const [createValue, setCreateValue] = useState({
    name: "",
    price: 0,
  });

  const orderHandler = (value) => {
    switch (value) {
      case true:
        return "asc";
        break;
      case false:
        return "desc";
        break;
    }
  };
  const pageCount = Math.ceil(totalData / dataPerPage);
  const pageClickHandler = (event) => {
    const newSkip = event.selected * dataPerPage;
    setPageSkip(newSkip);
  };

  const createProductHandler = async () => {
    setCreateIsLoading(true);
    try {
      const createResponse = await axios.post(
        `${import.meta.env.VITE_API_URL}/products/add`,
        {
          title: createValue.name,
          price: createValue.price,
        }
      );
      console.log(createResponse.data);
      productRefetch();
      Toast({
        title: "Create New Product Successfully",
        description: `Product Name: ${createResponse.data.title}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setCreateIsLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setCreateIsLoading(false);
      Toast({
        title: "Create New Product Failed",
        description: "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const updateProductHandler = async () => {
    setIsLoading(true);
    try {
      const updateResponse = await axios.put(
        `${import.meta.env.VITE_API_URL}/products/${selectedEditValue.id}`,
        {
          title: selectedEditValue.name,
          price: selectedEditValue.price,
        }
      );
      productRefetch();
      Toast({
        title: "Update Successfully",
        description: "",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Toast({
        title: "Update Failed",
        description: "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const deleteProductHandler = async (id) => {
    setIsLoading(true);
    try {
      const updateResponse = await axios.delete(
        `${import.meta.env.VITE_API_URL}/products/${id}`
      );
      productRefetch();
      Toast({
        title: "Delete Successfully",
        description: "",
        status: "info",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Toast({
        title: "Delete Failed",
        description: "",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const {
    data: productData,
    isLoading: productIsLoading,
    isError: productIsError,
    error: productError,
    refetch: productRefetch,
  } = useFetchData(`/products/search`, {
    limit: dataPerPage,
    skip: pageSkip,
    sortBy: selectedSearchFilterValue,
    order: orderHandler(selectedSearchOrderValue),
    q: searchValue,
  });

  const {
    data: categoryListData,
    isLoading: categoryListIsLoading,
    isError: categoryListIsError,
    error: categoryListError,
  } = useFetchData(`products/categories`);

  useEffect(() => {
    if (!productIsLoading) {
      setDataState(productData.products);
      setTotalData(productData.total);
    }
  }, [productData, searchValue]);

  useEffect(() => {
    setPageSkip(0 * dataPerPage);
    setSelectedPage(0);
  }, [selectedSearchFilterValue, selectedSearchOrderValue, searchValue]);

  return (
    <>
      <div className="h-screen bg-white-200 ">
        <div className="p-4 md:p-16 gap-4 flex flex-col gap-4">
          <div className="flex justify-between">
            <p className="text-2xl font-semibold">Manage Products </p>
            <Button
              onClick={createOnOpen}
              color="white"
              backgroundColor="green"
              leftIcon={<Plus color="white" />}
            >
              Create New Product
            </Button>
          </div>
          <Input
            placeholder="Cari Nama Barang"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          {categoryListIsLoading ? (
            <>
              <Skeleton height="20px" />
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <Menu className="col-start-4">
                  <MenuButton as={Button}>
                    Sortir {selectedSearchFilterValue}
                  </MenuButton>
                  <MenuList>
                    {sortValue.map((item, index) => {
                      return (
                        <MenuItem
                          onClick={() => setSelectedSearchFilterValue(item)}
                        >
                          {item}
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Menu>
                <Button
                  onClick={() =>
                    setSelectedSearchOrderValue(!selectedSearchOrderValue)
                  }
                >
                  {selectedSearchOrderValue ? (
                    <Button>
                      <ChevronDown />
                    </Button>
                  ) : (
                    <Button>
                      <ChevronUp />
                    </Button>
                  )}
                </Button>
              </div>
            </>
          )}
          <div className="flex justify-center">
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              breakClassName={"break-me"}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={pageClickHandler}
              containerClassName={"pagination"}
              activeClassName={"active"}
              forcePage={selectedPage}
            />
          </div>
          {productIsLoading ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton height="120px" />
                <Skeleton height="120px" />
                <Skeleton height="120px" />
                <Skeleton height="120px" />
              </div>
            </>
          ) : (
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-4`}>
              {dataState.length == 0 ? (
                <div className="text-xl absolute left-[49vw] flex flex-col justify-center items-center gap-2">
                  <Info size={50} />
                  Empty
                </div>
              ) : (
                <>
                  {dataState.map((item, index) => {
                    return (
                      <motion.div
                        initial="hidden"
                        whileInView="visible"
                        transition={{ duration: 0.3 }}
                        variants={{
                          visible: { opacity: 1, y: 0 },
                          hidden: { opacity: 0, y: 30 },
                        }}
                      >
                        <Card key={index}>
                          <CardBody>
                            <img
                              src={item.thumbnail}
                              className="object-cover h-[50%]"
                              alt="Image Alt"
                              loading="lazy"
                            />
                            <p>{item.title}</p>
                            <p>${item.price}</p>
                            <p>{item.rating}</p>
                            <div className="grid grid-cols-2 gap-4">
                              <Button
                                onClick={() => {
                                  onOpen();
                                  setSelectedEditValue({
                                    ...selectedEditValue,
                                    id: item.id,
                                    name: item.title,
                                    price: item.price,
                                  });
                                }}
                              >
                                <Pen />
                              </Button>
                              <Button
                                bg="red"
                                onClick={() => deleteProductHandler(item.id)}
                              >
                                <Trash color="white" />
                              </Button>
                            </div>
                          </CardBody>
                        </Card>
                      </motion.div>
                    );
                  })}
                </>
              )}
            </div>
          )}
        </div>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input
                  onChange={(e) =>
                    setSelectedEditValue({
                      ...selectedEditValue,
                      name: e.target.value,
                    })
                  }
                  value={selectedEditValue.name}
                  placeholder="Change Product Name Here"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input
                  onChange={(e) =>
                    setSelectedEditValue({
                      ...selectedEditValue,
                      price: e.target.value,
                    })
                  }
                  value={selectedEditValue.price}
                  placeholder="Change Price Here"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={isLoading}
                onClick={() => {
                  updateProductHandler();
                }}
                color="white"
                backgroundColor="green"
                mr={3}
              >
                Save
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Modal isOpen={createIsOpen} onClose={createOnClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Product</ModalHeader>
            <ModalCloseButton />
            <ModalBody pb={6}>
              <FormControl>
                <FormLabel>Product Name</FormLabel>
                <Input
                  onChange={(e) =>
                    setCreateValue({ ...createValue, name: e.target.value })
                  }
                  value={createValue.name}
                  placeholder="Change Product Name Here"
                />
              </FormControl>

              <FormControl mt={4}>
                <FormLabel>Price</FormLabel>
                <Input
                  onChange={(e) =>
                    setCreateValue({ ...createValue, price: e.target.value })
                  }
                  value={createValue.price}
                  placeholder="Change Price Here"
                  type="number"
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                isLoading={createIsLoading}
                onClick={() => {
                  createProductHandler();
                }}
                color="white"
                backgroundColor="green"
                mr={3}
              >
                Save
              </Button>
              <Button onClick={createOnClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}

export default ProductsPage;
