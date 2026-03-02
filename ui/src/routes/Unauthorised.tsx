import SiteLayout from "../views/app/SiteLayout";

export const Unauthorised = () => {
  return (
    <SiteLayout>
      <h1 class="text-center text-2xl">Access Denied</h1>
      <p class="text-center">You don't have permission to view this page.</p>
    </SiteLayout>
  );
};

export default Unauthorised;
