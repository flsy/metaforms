import React from 'react';
import {storiesOf} from "@storybook/react";
import { Input } from "antd-metaforms";

storiesOf('antd-metaforms', module).add('text input', () => <Input name="name" placeholder="placeholder" />);

