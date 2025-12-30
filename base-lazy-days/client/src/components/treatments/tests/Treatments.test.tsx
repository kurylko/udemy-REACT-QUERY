import { render, screen } from "@/test-utils";

import { Treatments } from "../Treatments";

test("renders response from query", async () => {
  render(<Treatments />);

  const treatmentTitles = await screen.findAllByRole("heading", {
     name: /massage|facial|scrub/i 
    });
  expect(treatmentTitles).toHaveLength(3);


});
