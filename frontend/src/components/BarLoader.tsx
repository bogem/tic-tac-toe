// The MIT License (MIT)
// Copyright (c) 2017 David Hu
//
// BarLoader is a Typescript and styled-components implementation of https://github.com/davidhu2000/react-spinners/blob/master/src/BarLoader.jsx.
// Author of original: David Hu.

import React from "react";
import styled, { keyframes } from "styled-components";

const long = keyframes`
  0% { left: -35%; right: 100% }
  60% { left: 100%; right: -90% }
  100% { left: 100%; right: -90% }
`;

const short = keyframes`
  0% { left: -200%; right: 100% }
  60% { left: 107%; right: -8% }
  100% { left: 107%; right: -8% }
`;

interface BarLoaderProps {
    loading: boolean;
    height: number;
    width: number;
}

export const BarLoader = ({ loading, ...rest }: BarLoaderProps) =>
    loading ? (
        <Wrapper {...rest}>
            <Bar i={1} />
            <Bar i={2} />
        </Wrapper>
    ) : null;

BarLoader.defaultProps = {
    height: 4,
    loading: true,
    width: 100,
};

interface WrapperProps {
    height: number;
    width: number;
}

const Wrapper = styled.div<WrapperProps>`
    background-clip: padding-box;
    background-color: rgba(0, 115, 157, 0.2);
    height: ${props => props.height}px;
    overflow: hidden;
    position: relative;
    width: ${props => props.width}px;
`;

interface BarProps {
    i: 1 | 2;
}

export const Bar = styled.div<BarProps>`
    animation: ${props => (props.i === 1 ? long : short)} 2.1s ${props => (props.i === 2 ? "1.15s" : "")}
        ${props => (props.i === 1 ? "cubic-bezier(0.65, 0.815, 0.735, 0.395)" : "cubic-bezier(0.165, 0.84, 0.44, 1)")}
        infinite;
    animation-fill-mode: forwards;
    background-clip: padding-box;
    background-color: rgb(0, 115, 157);
    border-radius: 2px;
    height: 100%;
    overflow: hidden;
    position: absolute;
    will-change: left, right;
`;
