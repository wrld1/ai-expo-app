import { colors } from "@/constants/theme";
import Ionicons from "@react-native-vector-icons/ionicons";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { DynamicColorIOS } from "react-native";

export default function TabsLayout() {
  return (
    <NativeTabs
      labelStyle={{
        color: DynamicColorIOS({
          dark: colors.accent,
          light: colors.accent,
        }),
      }}
      tintColor={DynamicColorIOS({
        dark: colors.accent,
        light: colors.accent,
      })}
    >
      <NativeTabs.Trigger name="index">
        <Label>Аналіз</Label>
        <Icon
          sf="camera.viewfinder"
          androidSrc={<VectorIcon family={Ionicons} name="camera" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="history">
        <Label>Журнал</Label>
        <Icon
          sf="clock.fill"
          androidSrc={<VectorIcon family={Ionicons} name="time" />}
        />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Label>Профіль</Label>
        <Icon
          sf="person.crop.circle.fill"
          androidSrc={<VectorIcon family={Ionicons} name="person" />}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
