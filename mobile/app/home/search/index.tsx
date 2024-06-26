import { useEffect, useState } from "react";
import { View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSearch } from "@gno/hooks/use-search";
import SearchResults from "@gno/components/list/search/search-result-list";
import { colors } from "@gno/styles/colors";

export default function Search() {
  const router = useRouter();
  const params = useLocalSearchParams<{ q?: string }>();
  const search = useSearch();
  const [data, setData] = useState<string[]>([]);

  useEffect(() => {
    (async function () {
      if (params.q) {
        const result = await search.searchUser(params.q, true);
        setData(result);
      } else {
        setData([]);
      }
    })();
  }, [params.q]);

  const onPress = (accountName: string) => {
    router.navigate({ pathname: "account", params: { accountName } });
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen
        options={{
          title: "Search",
					headerStyle: {
						backgroundColor: colors.grayscale[50],
					},
          headerSearchBarOptions: {
            autoCapitalize: "none",
            inputType: "text",
						textColor: "black",
            onChangeText: (event) => {
              router.setParams({
                q: event.nativeEvent.text,
              });
            },
          },
        }}
      />
      <SearchResults data={data} onPress={onPress} />
    </View>
  );
}
