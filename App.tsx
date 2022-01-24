import React, {useState, useCallback} from 'react';
import {StatusBar, FlatList, View} from 'react-native';
import {Profile} from './components/Profile';
import {IProfile} from './components/Profile.types';

import faker from '@faker-js/faker';

faker.seed(10);
const DATA = [...Array(5).keys()].map((_, i) => {
  return {
    key: faker.datatype.uuid(),
    image: `https://randomuser.me/api/portraits/${faker.helpers.randomize([
      'women',
      'men',
    ])}/${faker.datatype.number(60)}.jpg`,
    name: faker.name.findName(),
    jobTitle: faker.name.jobTitle(),
    email: faker.internet.email(),
  };
});

const SPACING = 20;

const App = () => {
  const [profile, setProfile] = useState(DATA);

  const removeProfile = useCallback(
    (key: string) =>
      setProfile(prevData => prevData.filter(d => d.key !== key)),
    [],
  );

  const renderItem = ({item}: {item: IProfile}) => (
    <Profile profile={item} removeProfile={removeProfile} />
  );

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <FlatList
        data={profile}
        contentContainerStyle={{
          padding: SPACING,
          paddingTop: StatusBar.currentHeight || 42,
        }}
        renderItem={renderItem}
        keyExtractor={item => item.key}
      />
      {/* <StatusBar hidden /> */}
    </View>
  );
};

export default App;
