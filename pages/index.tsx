import {Button, Input, Divider} from "@nextui-org/react";
import {useState, useRef} from "react";
import {CLIENT_ID, TWO_FACTOR_AUTHENTICATION_DOMAIN} from "@/config/constants";
import {DateTimeDuration} from "@internationalized/date";
import {EyeFilledIcon, EyeSlashFilledIcon} from "@nextui-org/shared-icons";

interface CharacterTime {
    character: string;
    beginTime: number;
    endTime: number;
}

export default function IndexPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const keys = useRef(new Map<string, number>());
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => setIsVisible(!isVisible);
    const characterTime = useRef<CharacterTime[]>([]);
    const actualCharacterBeginTime = useRef<Date>(new Date());


    const resetKeystrokeDynamics = () => {
        characterTime.current = [];
    }


    const login = async () => {
        if (username.length === 0) {
            setUsername("");
            setPassword("");
            alert("Please enter a username");
            return;
        }

        // if username contains spaces then alert
        if (username.includes(" ")) {
            setUsername("");
            setPassword("");
            alert("Username cannot contain spaces");
            return;
        }

        if (password.length === 0) {
            setUsername("");
            setPassword("");
            alert("Please enter a password");
            return;
        }


        const twoFactorPayload = {
            username,
            'characterTime': characterTime.current,
            'client_id': CLIENT_ID,
        }

        // TODO mock
        console.log('-------------PAYLOAD TO SEND TO 2FA BACKEND----------')
        console.log(twoFactorPayload);
        console.log('-----------------------------------------------------')
        console.log('-------------HASH RECEIVED FROM 2FA BACKEND----------')
        const response = await fetch(`${TWO_FACTOR_AUTHENTICATION_DOMAIN}/auth`,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(twoFactorPayload)
            });
        const responseJson = await response.json();
        const hash = responseJson.payload;
        console.log(hash);
        console.log('-----------------------------------------------------')

        const res = await fetch("/api/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password,
                hash,
                characterTime: characterTime.current,
            })
        });
        const data = await res.json() as {
            token: string | undefined,
            message: string,
            success: boolean
        };

        if (data.success) {
            localStorage.setItem("token", data.token!);
            resetKeystrokeDynamics();
            setUsername("");
            setPassword("");
            alert("Logged in successfully!");
        } else {
            resetKeystrokeDynamics();
            setUsername("");
            setPassword("");
            alert(data.message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 h-full w-full">
            <div className="flex-col justify-center items-center">
                <div>
                    <Input type="text" label="Username" placeholder="Enter your username" labelPlacement="outside"
                           description="Your username typing pattern will be used to identify you."
                           value={username}
                           onChange={(e) => {
                               setUsername(e.target.value);
                           }}
                           onKeyDown={async (e) => {
                               if (e.keyCode === 13) {
                                   await login();
                                   setUsername("");
                                   setPassword("");
                                   resetKeystrokeDynamics();
                               }
                               // if backspace then reset and delete the whole array
                               const actualTime = performance.now();
                               const key = e.key;
                               if (!keys.current.has(key)) {
                                   keys.current.set(key, actualTime);
                               }
                           }
                           }
                           onKeyUp={async (e) => {
                               if (e.keyCode === 8) {
                                   resetKeystrokeDynamics();
                                   setUsername("");
                                   setPassword("");
                                   return;
                               }
                               const actualTime = performance.now();
                               const key = e.key;

                               if (keys.current.has(key)) {
                                   const startTime = keys.current.get(key)!;
                                   characterTime.current.push({
                                       character: key,
                                       beginTime: startTime,
                                       endTime: actualTime
                                   });
                                   keys.current.delete(key);
                               }
                           }}
                    />
                </div>
                <div className="mt-4 mb-4"/>
                <div>
                    <Input label="Password" placeholder="Enter your password"
                           labelPlacement="outside" isClearable={false} value={password}
                           endContent={
                               <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                                   {isVisible ? (
                                       <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                   ) : (
                                       <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                                   )}
                               </button>
                           }
                           type={isVisible ? "text" : "password"}
                           onChange={(e) => setPassword(e.target.value)}
                           onKeyDown={async (e) => {
                               if (e.keyCode === 13) {
                                   await login();
                                   resetKeystrokeDynamics();
                                   setUsername("");
                                   setPassword("");
                               }
                           }}/>
                </div>
                <Divider className="mt-8 mb-8"/>
                <div className="flex flex-row gap-4 items-center justify-center">
                    <Button color="primary" className="text-white" onClick={login}>
                        Login
                    </Button>
                    <Button color="success" className="text-white">
                        Signup
                    </Button>
                </div>
            </div>
        </div>
    );
}
