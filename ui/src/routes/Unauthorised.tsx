import { Container } from "@solidpb/ui-kit";

export const Unauthorised = () => {
  return (
    <Container>
      <h1 class="">Access Denied</h1>
      <p class="">You don't have permission to view this page.</p>
    </Container>
  );
};

export default Unauthorised;
