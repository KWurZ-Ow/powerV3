import React, { FunctionComponent, useState, MutableRefObject } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

interface IProps {
  onChange: (input: string) => void;
  keyboardRef: MutableRefObject<typeof Keyboard>;
}

const KeyboardWrapper: FunctionComponent<IProps> = ({
  onChange,
  keyboardRef
}) => {
  const [layoutName, setLayoutName] = useState("default");

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };
  const customLayout = {
    'default': [
      'S R E 0 1 2',
      'C B M 3 4 5',
      'D C R 6 7 8',
      'P H Q S I',
      'V B J R {bksp} {enter}'
    ]
  }

  let customDisplay = {
    '{bksp}': '←',
    '{enter}': '↪',
  }

  return (
    <Keyboard
      keyboardRef={r => (keyboardRef.current = r)}
      layoutName={layoutName}
      onChange={onChange}
      onKeyPress={onKeyPress}
      onRender={() => console.log("Rendered")}
      layout={customLayout}
      display={customDisplay}
    />
  );
};

export default KeyboardWrapper;
