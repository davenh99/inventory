import { Component, createSignal, Show } from "solid-js";

import AuthEmail from "../views/auth/AuthEmail";
import { Button } from "../components";
import Card from "../views/app/Card";

const Auth: Component = () => {
  const [emailLogin, setEmailLogin] = createSignal(false);

  return (
    <div class="flex-1 h-full flex flex-col items-center justify-center bg-[var(--color-light-background)] dark:bg-[var(--color-dark-background)]">
      <Card class="w-[90vw] max-w-80 flex flex-col items-center pb-5">
        <Show
          when={!emailLogin()}
          fallback={
            <>
              <AuthEmail />
              <Button variant="text" onClick={() => setEmailLogin(false)}>
                <p>Sign in another way</p>
              </Button>
            </>
          }
        >
          <h2 class="mb-6 text-[var(--color-text-light-primary)] dark:text-[var(--color-dark-primary)]">
            Sign in
          </h2>
          <Button class="w-[95%]" appearance="neutral" onClick={() => setEmailLogin(true)}>
            Continue with Email
          </Button>
        </Show>
      </Card>
    </div>
  );
};

export default Auth;
