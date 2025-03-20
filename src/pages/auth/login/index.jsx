import {
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
  Card,
  CardBody,
  useToast
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
  const toast = useToast()
  const [usernameValue, setUsernameValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const usernameIsError = usernameValue === "";
  const passwordIsError = passwordValue === "";

  const submitHandler = async (e) => {
    e.preventDefault()
    setIsLoading(true);
    try {
      await fetch('https://dummyjson.com/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          
          username: 'emilys',
          password: 'emilyspass',
          expiresInMins: 30, // optional, defaults to 60
        }),
        credentials: 'include' // Include cookies (e.g., accessToken) in the request
      })
      .then(res => res.json())
      .then(console.log);
      
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="h-screen flex flex-col justify-center bg-[#3F7D58]">
        <Card className="m-4">
          <CardBody>
            <form
              className="flex flex-col gap-4"
              onSubmit={submitHandler}
              noValidate
            >
              <FormControl isInvalid={usernameIsError}>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  value={usernameValue}
                  onChange={(e) => setUsernameValue(e.target.value)}
                />
                {!usernameIsError ? (
                  <></>
                ) : (
                  <FormErrorMessage>Username is required</FormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={passwordIsError}>
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  value={passwordValue}
                  onChange={(e) => setPasswordValue(e.target.value)}
                />
                {!passwordIsError ? (
                  <></>
                ) : (
                  <FormErrorMessage>Password is required</FormErrorMessage>
                )}
              </FormControl>
              <Button isLoading={isLoading}  type="submit" isDisabled={usernameIsError || passwordIsError}>
                Login
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
