import { Button, Dropdown, Label } from "@heroui/react"
import logo from "../../assets/Screenshot 2026-10-10 224500.png"
import { ChevronDown, House, MessageSquareText, Settings, User } from "lucide-react"
import { useTokenContext } from "../../Context/TokenContext"
import { NavLink, useNavigate } from "react-router"
import { useUserContext } from "../../Context/UserContext"
export default function Navbar() {


  const { setToken } = useTokenContext()
  const { userDetails } = useUserContext();

  const navigate = useNavigate()
  function Logout() {
    localStorage.removeItem("userToken")
    setToken(null)
    navigate("/auth/login", { replace: true })
  }



  return (
    <>

      <nav className='bg-gray-300 py-5 px-20 '>

        <div className="container mx-auto flex justify-between items-center">
          <div className="nav-logo">
            <img src={logo} className="rounded-full" width={80} alt="logo" />

          </div>
          <div className="nav-links flex gap-2">
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 ${isActive ? "bg-white text-main" : "text-gray-700 hover:bg-white/60"}`
              }
              to="/feed"
            >
              <House size={18} />
              Feed
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 ${isActive ? "bg-white text-main" : "text-gray-700 hover:bg-white/60"}`
              }
              to="/profile"
            >
              <User size={18} />
              Profile
            </NavLink>
            <NavLink
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 ${isActive ? "bg-white text-main" : "text-gray-700 hover:bg-white/60"}`
              }
              to="/notification"
            >
              <MessageSquareText size={18} />
              Notifications
            </NavLink>
          </div>
          <div className="nav-actions">
            <Dropdown>
              <Button aria-label="Menu" variant="primary" >


                <div className="w-8 h-8">
                  <img src={userDetails?.photo} alt="" className="w-full rounded-full" />
                </div>


                {userDetails?.name}
                <ChevronDown />
              </Button>
              <Dropdown.Popover>
                <Dropdown.Menu onAction={(key) => {
                  if (key === "Log out") Logout()
                  if (key === "Profile") navigate("/profile")
                }}>
                  <Dropdown.Item id="Profile" textValue="Profile">
                    <User />
                    <Label>Profile</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="Settings" textValue="Settings">
                    <Settings />
                    <Label>Settings</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="Log out" variant="danger" textValue="Log out">
                    <Label>Log out</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>

        </div>
      </nav>

    </>
  )
}
