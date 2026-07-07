import { NativeTabs, Label, Icon, VectorIcon } from "expo-router/unstable-native-tabs";
import Ionicons from "@react-native-vector-icons/ionicons";

export default function TabsLayout() {
  return (
    <NativeTabs>
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
