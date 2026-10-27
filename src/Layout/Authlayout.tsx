import { Outlet } from "react-router"
import Authintro from "../components/Authintro/Authintro"

export default function Authlayout() {
    return (
        <>
            <main className="bg-sec">

                <div className="container mx-auto ">
                    <div className="grid lg:grid-cols-2">
                        <div className="">

                            <Authintro/>

                        </div>
                        <div className="">
                            <Outlet />
                        </div>
                    </div>
                </div>





            </main >
        </>
    )
}
