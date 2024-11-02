declare module "react-native-draggable-flatlist" {
  import { ComponentType } from "react";
  import { ViewStyle, StyleProp } from "react-native";

  interface RenderItemParams<T> {
    item: T;
    index: number;
    drag: () => void;
    isActive: boolean;
  }

  interface DraggableFlatListProps<T> {
    data: T[];
    renderItem: (params: RenderItemParams<T>) => JSX.Element;
    keyExtractor: (item: T, index: number) => string;
    onDragEnd: (params: { data: T[]; from: number; to: number }) => void;
    style?: StyleProp<ViewStyle>;
  }

  const DraggableFlatList: ComponentType<DraggableFlatListProps<any>>;
  export default DraggableFlatList;
}
