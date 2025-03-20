import { Box, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate()
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="px-4 flex items-center justify-between h-[80px]  bg-[#3F7D58]">
        <div className="flex items-center gap-2">
          <Box size={40} color="white " />
          <p className=" italic text-3xl text-white">Toko Hepi</p>
        </div>
        {open ? (
          <ChevronUp size={40} color="white" onClick={() => setOpen(!open)} />
        ) : (
          <ChevronDown
            size={40}
            color="white "
            onClick={() => setOpen(!open)}
          />
        )}
      </div>
      <div
        className={`${
          open ? "" : "hidden"
        } flex justify-between h-[140px] bg-slate-200`}
      >
        <div className="w-full flex flex-col justify-center gap-2 py-2">
          <div onClick={() => navigate('/management/analytics')} className="px-4 hover:bg-slate-400 w-full h-full">
            <p  className="text-xl">Analytic</p>
          </div>
          <div onClick={() => navigate('/management/products')} className="px-4 hover:bg-slate-400 w-full h-full">
            <p className="text-xl">Products Management</p>
          </div>
          <div onClick={() => navigate('/landing')} className="px-4 hover:bg-slate-400 w-full h-full">
            <p className="text-xl">Landing Page</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
