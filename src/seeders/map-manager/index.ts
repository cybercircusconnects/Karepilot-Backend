import seedMapManagerData from "./mapManager.seeder";

const runMapManagerSeeders = async () => {
  await seedMapManagerData();
};

export default runMapManagerSeeders;


