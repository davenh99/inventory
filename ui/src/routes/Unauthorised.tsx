import { Container } from "@solidpb/ui-kit";

export const Unauthorised = () => {
  return (
    <Container>
      <h1 class="text-text-light-primary dark:text-dark-primary">Access Denied</h1>
      <p class="text-text-light-secondary dark:text-dark-secondary">
        You don't have permission to view this page.
      </p>
    </Container>
  );
};

export default Unauthorised;
