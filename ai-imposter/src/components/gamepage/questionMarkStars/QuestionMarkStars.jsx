import { Flex, Text } from "@mantine/core";
import classes from "./QuestionMarkStars.module.css";
import { Astroid } from "lucide-react";

const QuestionMarkStars = () => {
  return (
    <div className={classes["questionMark-wrapper"]}>
      <Flex className={classes["questionMark-Container"]}>
        <Text className={classes["questionMark"]}>?</Text>
      </Flex>
      <Astroid
        className={[classes["astroid"], classes["astroid1"]].join(" ")}
      />
      <Astroid
        className={[classes["astroid"], classes["astroid2"]].join(" ")}
      />
      <Astroid
        className={[classes["astroid"], classes["astroid3"]].join(" ")}
      />
      <Astroid
        className={[classes["astroid"], classes["astroid4"]].join(" ")}
      />
      <Astroid
        className={[classes["astroid"], classes["astroid5"]].join(" ")}
      />
    </div>
  );
};

export default QuestionMarkStars;
