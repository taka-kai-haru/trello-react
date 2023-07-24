/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { FormControl, FormLabel, Grid, Switch } from "@mui/material";
import { styled } from "@mui/material/styles";
import { FC, useEffect, useState } from "react";

interface ColorSelectionProps {
  labelColor: string;
  setLabelColor: (color: string) => void;
}

const colorOptions = [
  "#233075",
  "#852e2e",
  "#654f1c",
  "#1b5733",
  "#5b487a",
  "#5d636c",
];

export const ColorSelection: FC<ColorSelectionProps> = (props) => {
  const { labelColor, setLabelColor } = props;
  const [isColorSelectPossible, setIsColorSelectPossible] =
    useState<boolean>(false);

  const handleColorChange = (color: string) => {
    setLabelColor(color);
  };

  // 色の選択が可能かどうかの切り替え
  useEffect(() => {
    if (labelColor === "") {
      setIsColorSelectPossible(false);
    } else {
      setIsColorSelectPossible(true);
    }
  }, [labelColor]);

  const switchOnChangeHandler = () => {
    // isColorSelectPossibleは既に反転している状態で渡される

    if (isColorSelectPossible) {
      setLabelColor("");
    } else {
      setLabelColor(colorOptions[0]);
    }

    setIsColorSelectPossible(!isColorSelectPossible);
  };

  return (
    <FormControl fullWidth>
      <Grid css={Container} container alignItems="center" spacing={2}>
        <Switch
          onChange={switchOnChangeHandler}
          checked={isColorSelectPossible}
        />
        {isColorSelectPossible ? (
          <>
            {colorOptions.map((color) => (
              <div
                css={ColorPickerBox(labelColor === color)}
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </Grid>
    </FormControl>
  );
};

const Container = css`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorPickerBox = (isSelected: boolean) => css`
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: 0.2px solid ${isSelected ? "#e4e4e4" : "transparent"};
  position: relative;
  cursor: pointer;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 50%;
    pointer-events: none;
    background-color: transparent;
    border-radius: 8px 8px 0 0; // To create rounded corners only at the top
  }
`;
