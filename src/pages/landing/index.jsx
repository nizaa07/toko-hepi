import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  ChevronDown,
  Info,
  ChevronUp,
  Pen,
  Star,
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
  useToast
} from "@chakra-ui/react";
import ReactPaginate from "react-paginate";
import useFetchData from "../../query/useFetchData";
import "./landing.css";

const sortValue = ["title", "price", "rating"];

function LandingPage() {
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState(1)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isLoading, setIsLoading] = useState(false)
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
    name: '',
    price: 0
  })

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


  const {
    data: productData,
    isLoading: productIsLoading,
    isError: productIsError,
    error: productError,
    refetch: productRefetch
  } = useFetchData(`/products/search`, {
    limit: dataPerPage,
    skip: pageSkip,
    sortBy: selectedSearchFilterValue,
    order: orderHandler(selectedSearchOrderValue),
    q: searchValue,
  });

  const {
    data: productByIdData,
    isLoading: productByIdIsLoading,
    isError: productByIdIsError,
    error: productByIdError,
  } = useFetchData(`/products/${selectedId}`);


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
    setPageSkip(0 * dataPerPage)
    setSelectedPage(0)
  }, [selectedSearchFilterValue, selectedSearchOrderValue, searchValue])

  if (
    productIsError ||
    categoryListError ||
    productByIdError ||
    productError
  )
    return (
      <div className="w-screen h-screen flex flex-row justify-center items-center">
        <WifiOff />
        error
      </div>
    );

  return (
    <>
      <div className="h-screen bg-[#3F7D58] flex flex-col justify-around items-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5 }}
          variants={{
            visible: { opacity: 1, y: 30 },
            hidden: { opacity: 0, y: 0 },
          }}
          className="text-center flex flex-col items-center"

        >
          <Box size={100} color='#EFEFEF'/>
          <p className="text-6xl text-[#EFEFEF] font-semibold">Toko Hepi</p>
          <p className="text-2xl text-[#EFEFEF] font-semibold">
            The Most Complete Shop
          </p>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          variants={{
            visible: { opacity: 1, y: 20 },
            hidden: { opacity: 0, y: 0 },
          }}
        >
          <ChevronDown color="white" size={50} />
        </motion.div>
      </div>
      <div className="bg-white-200">
        <div className="my-8 p-4 md:p-16 gap-4 flex flex-col gap-4">
          <p className="pb-4 text-2xl text-center font-semibold italic">Find your Desired Product Here</p>
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
            <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4`}>
              {dataState.length == 0 ? (
                <div className="text-xl absolute left-[49vw] flex flex-col justify-center items-center gap-2">
                  <Info size={50}/>
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
                        whileHover={{y: -10}}
                        variants={{
                          visible: { opacity: 1, y: 0 },
                          hidden: { opacity: 0, y: 30 },
                        }}
                      >
                        <Card onClick={() => {setSelectedId(item.id) ;onOpen()}} key={index} _hover={{backgroundColor: 'gray.100'}}>
                          <CardBody mx='auto'>
                            <img
                              src={item.thumbnail}
                              className="object-cover h-[50%]"
                              alt="Image Alt"
                              loading="lazy"
                            />
                            <p>{item.title}</p>
                            <p>${item.price}</p>
                            <div className="flex items-center gap-1">
                            <Star size={15} color="orange"/>
                            <p>{item.rating}</p>
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
        <div className="flex flex-col items-center justify-center w-screen h-[20vh] bg-[#3F7D58]">
          <p className="text-xl text-slate-100 font-semibold italic">Are you Employee?</p>\
          <Button onClick={() => navigate('/management/analytics')}>Click Here to Management Dashboard</Button>
        </div>
        <Modal
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Product Detail</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {
              productByIdIsLoading ? <div className="w-[400px] h-[400px]">loading</div> : <>
               <img className="w-[400px] h-[400px]" src={productByIdData.images} alt='https://placehold.co/600x600/png'  />
               <p className="text-2xl font-semibold">{productByIdData.title}</p>
               <Badge>{productByIdData.category}</Badge>
               <div className="flex items-center gap-1">
                <Star color="orange" size={17}/> {productByIdData.rating}
               </div>
               <p className="text-xl font-semibold italic">$ {productByIdData.price}</p>
              <p>{productByIdData.description}</p>
              </>
            }
           
          </ModalBody>
        </ModalContent>
      </Modal>
      </div>
    </>
  );
}

export default LandingPage;
