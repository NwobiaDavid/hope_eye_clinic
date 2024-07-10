import { Link, useLocation } from "react-router-dom"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet"
import { Menu } from 'lucide-react';
// import { usePatient } from '../../PatientContext';

const NavvBar = () => {

    const location = useLocation();
    // const { selectedPatient } = usePatient();

    // location.pathname
    const routes = [
 {
            link: "/appointments",
            label: "appointments"
        },{
          link: "/consultations",
          label: "consultations"
      },{
        link: "/tests",
        label: "tests"
      },{
        link: "/surgeries",
        label: "surgeries"
      },{
        link: "/drug-inventory",
        label: "drug inventory"
      },{
        link: "/store-inventory",
        label: "store inventory"
      },{
        link: "/history",
        label: "record history"
      }
    ]
    return (
        <div className="flex py-3 justify-between px-6 border-b  " >

            <div className=" flex" >
                    <Sheet >
                        <SheetTrigger className="p-3 flex justify-center items-center hover:text-white transition-all hover:bg-slate-500 rounded-xl " >
                            <Menu />
                        </SheetTrigger>
                        <SheetContent side={"left"} >
                            <SheetHeader className="mb-3 " >
                                <SheetTitle className="py-2">
                                    <Link to={"/"} className="p-2 text-xl ">
                                        Hope Eye Care
                                    </Link>
                                </SheetTitle>
                            </SheetHeader>
                            <div className="w-full text-lg  " >
                                {routes.map((item, index) => (
                                    <Link key={index} className="  " to={`${item.link}`} >
                                        <div className={` py-3 capitalize mb-2 px-3  rounded-md border   ${item.link === location.pathname ? " bg-slate-700 text-white hover:bg-slate-900 border-slate-700 " : " border-white hover:bg-slate-300 hover:border-slate-700  "} `} >{item.label}</div>
                                    </Link>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                <div className="flex ml-4 justify-center items-center " >
                    <Link to={"/"} className="text-2xl font-bold " >
                    Hope Eye Care
                    </Link>
                </div>
            </div>
            <div className="flex flex-col justify-center items-center text-xl " >
            <h2> Admin</h2>
            <p className=" font-semibold text-xs">(admin)</p>
            </div>

        </div>
    )
}

export default NavvBar