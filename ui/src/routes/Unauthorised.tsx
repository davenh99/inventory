import Container from "../views/app/Container";

export const Unauthorised = () => {
  return (
    <Container>
      <h1 class="text-[var(--color-text-light-primary)] dark:text-[var(--color-dark-primary)]">
        Access Denied
      </h1>
      <p class="text-[var(--color-text-light-secondary)] dark:text-[var(--color-dark-secondary)]">
        You don't have permission to view this page.
      </p>
    </Container>
  );
};

export default Unauthorised;
