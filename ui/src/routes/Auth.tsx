import { Component, createSignal, Show } from "solid-js";

import AuthEmail from "../views/auth/AuthEmail";
import { Button, Card } from "@solidpb/ui-kit";

const Auth: Component = () => {
  const [emailLogin, setEmailLogin] = createSignal(false);

  return (
    <div class="flex-1 h-full flex flex-col items-center justify-center">
      <Card
        class="w-[90vw] max-w-80 items-center text-center"
        img={emailLogin() ? undefined : "/assets/icon.png"}
      >
        <Card.Title class="mb-5 justify-center">Sign In</Card.Title>
        <Show
          when={!emailLogin()}
          fallback={
            <>
              <AuthEmail />
              <Button variant="ghost" onClick={() => setEmailLogin(false)}>
                Sign in another way
              </Button>
            </>
          }
        >
          <Button modifier="block" appearance="neutral" onClick={() => setEmailLogin(true)}>
            Continue with Email
          </Button>
        </Show>
      </Card>
    </div>
  );
};

export default Auth;
