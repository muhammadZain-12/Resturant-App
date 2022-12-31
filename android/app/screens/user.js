import React, {useCallback, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  ViewBase,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import Icon from 'react-native-vector-icons/AntDesign';
import pizza from '../assets/pizza.webp';
import coldDrink from '../assets/coldDrink.jpg';

function User({navigation, route}) {
  const [userData, setUserData] = React.useState([]);
  const [itemCategory, setItemCategory] = React.useState({
    title: '',
    active: false,
  });
  const [mainCategory, setMainCategory] = React.useState({
    items: false,
    deals: false,
  });

  const [dealName, setDealName] = React.useState([]);
  const [allCategory, setAllCategory] = React.useState([]);
  const [itemData, setItemData] = React.useState([]);
  const [dealData, setDealData] = React.useState([]);
  const [allData, setAllData] = React.useState([]);
  const [width, setWidth] = React.useState('');
  const [inputValue, setInputValue] = React.useState('');

  useEffect(() => {
    auth().onAuthStateChanged(user => {
      if (user) {
        setUserData(user);
      } else {
        navigation.navigate('login');
      }
    });
  }, []);

  useEffect(() => {
    let widths = Dimensions.get('window').width;
    setWidth(widths);
  }, []);

  const getCategoryFromDb = () => {
    database()
      .ref('items')
      .once('value', e => {
        let val = e.val();

        let allItemData = Object.entries(val).map(([key, value]) => {
          value.id = key;
          return value;
        });
        setItemData(allItemData);

        val = Object.values(val);

        let category = val.map((e, i) => {
          return e.itemCategory;
        });
        category = [...new Set([...category])];

        let a = [];

        category.map((e, i) => {
          b = {};
          b.title = e;
          b.active = false;
          a.push(b);
        });
        setItemCategory(a);
      });
  };

  const getDealsFromDb = () => {
    database()
      .ref('Deals')
      .once('value', e => {
        let val = e.val();

        let allDealData = Object.entries(val).map(([key, value]) => {
          value.id = key;
          return value;
        });
        setDealData(allDealData);

        val = Object.values(val);

        let category = val.map((e, i) => {
          return e.dealName;
        });
        category = [...new Set([...category])];

        let a = [];

        category.map((e, i) => {
          b = {};
          b.title = e;
          b.active = false;
          a.push(b);
        });
        setDealName(a);
      });
  };

  useEffect(() => {
    getCategoryFromDb();
    getDealsFromDb();
  }, []);

  useEffect(() => {
    let a = [];
    itemCategory &&
      itemCategory.length > 0 &&
      itemCategory.map((e, i) => {
        a.push(e);
      });
    let b = [];
    b = [...a, ...dealName];

    setAllCategory(b);

    setAllData([...itemData, ...dealData]);
  }, [dealName, dealData]);

  const activeItem = item => {
    setItemCategory(
      itemCategory.map((e, i) => {
        if (item.title == e.title) {
          return {
            ...e,
            active: e.active ? false : true,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const activeDeals = item => {
    setDealName(
      dealName.map((e, i) => {
        if (item.title == e.title) {
          return {
            ...e,
            active: e.active ? false : true,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const activeAllCategory = item => {
    setAllCategory(
      allCategory.map((e, i) => {
        if (item.title == e.title) {
          return {
            ...e,
            active: e.active ? false : true,
          };
        } else {
          return e;
        }
      }),
    );
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() =>
          mainCategory.items
            ? activeItem(item)
            : mainCategory.deals
            ? activeDeals(item)
            : activeAllCategory(item)
        }
        style={{
          width: mainCategory.deals ? 180 : mainCategory.items ? 120 : 180,
          borderWidth: 1,
          borderRadius: 20,
          padding: 10,
          backgroundColor: item.active ? '#8888ee' : 'black',
        }}>
        <Text
          style={{color: item.active ? 'black' : 'white', textAlign: 'center'}}>
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  const selectMainCategory = selectedCategory => {
    if (selectedCategory == 'items') {
      setMainCategory({
        ...mainCategory,
        items: mainCategory.items ? false : true,
        deals: false,
      });
    } else {
      setMainCategory({
        ...mainCategory,
        deals: mainCategory.deals ? false : true,
        items: false,
      });
    }
  };

  let index = 0;

  const RenderAllData = useCallback(
    e => {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('singleItem', e)}
          style={{
            width: '49%',
            borderColor: 'black',
            alignItems: 'center',
            padding: 5,
            marginBottom: 5,
            borderRadius: 10,
          }}>
          <Image
            source={e.itemCategory == 'Cold drink' ? coldDrink : pizza}
            style={{
              width: 170,
              height: 140,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
          <View
            style={{
              width: 170,
              backgroundColor: 'gray',
              paddingBottom: 5,
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10,
              paddingTop: 3,
            }}>
            <Text
              style={{
                color: 'white',
                width: '90%',
                marginLeft: 8,
                fontWeight: '700',
                fontSize: 18,
              }}
              numberOfLines={1}>
              {e.dealName ? e.dealName : e.itemName}
            </Text>
            <Text
              style={{
                color: 'white',
                width: '100%',
                marginLeft: 8,
                fontSize: 16,
                fontWeight: '500',
              }}
              numberOfLines={1}>
              {e.dealPrice ? e.dealPrice : e.itemPrice}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [allData],
  );

  return (
    <View>
      <ScrollView>
        <View style={{width: '100%', alignItems: 'center', marginTop: 10}}>
          <View
            style={{
              width: '90%',
              borderWidth: 1,
              borderColor: 'black',
              borderRadius: 15,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}>
            <TextInput
              style={{width: '80%', color: 'black', fontSize: 18}}
              placeholder="What do you want?"
              placeholderTextColor="black"
              onChangeText={setInputValue}
            />
            <TouchableOpacity>
              <Icon name="search1" size={30} color={'black'} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              margin: 10,
              justifyContent: 'center',
            }}>
            <TouchableOpacity
              onPress={() => selectMainCategory('items')}
              style={{
                width: 120,
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                marginLeft: 10,
                backgroundColor: mainCategory.items ? '#8888ee' : 'black',
              }}>
              <Text
                style={{
                  color: mainCategory.items ? 'black' : 'white',
                  textAlign: 'center',
                }}>
                ITEMS
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => selectMainCategory('deals')}
              style={{
                width: 120,
                borderWidth: 1,
                borderRadius: 20,
                padding: 10,
                marginLeft: 10,
                backgroundColor: mainCategory.deals ? '#8888ee' : 'black',
              }}>
              <Text
                style={{
                  color: mainCategory.deals ? 'black' : 'white',
                  textAlign: 'center',
                }}>
                DEALS
              </Text>
            </TouchableOpacity>
          </View>
          {mainCategory.items ? (
            <FlatList
              data={itemCategory}
              horizontal={true}
              renderItem={renderItem}
              style={{marginTop: 10, width: '100%', marginLeft: 20}}
            />
          ) : mainCategory.deals ? (
            <FlatList
              data={dealName}
              horizontal={true}
              renderItem={renderItem}
              style={{marginTop: 10, width: '100%', marginLeft: 20}}
            />
          ) : (
            <FlatList
              data={allCategory}
              horizontal={true}
              renderItem={renderItem}
              style={{marginTop: 10, width: '100%', marginLeft: 20}}
            />
          )}
        </View>

        {mainCategory.items ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View
              style={{
                width: '96%',
                height: '100%',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              {itemCategory &&
                itemCategory.length > 0 &&
                itemCategory.map((e, i) => {
                  if (e.active) {
                    return (
                      itemData &&
                      itemData.map((value, ind) => {
                        if (value.itemCategory === e.title) {
                          if (inputValue && inputValue.length > 0) {
                            if (
                              value.itemName.includes(inputValue) ||
                              value.itemCategory.includes(inputValue)
                            ) {
                              return RenderAllData(value);
                            }
                          } else {
                            return RenderAllData(value);
                          }
                        }
                      })
                    );
                  } else if (!e.active) {
                    index = index + 1;
                  }

                  if (index == itemCategory.length) {
                    index = 0;
                    return (
                      itemData &&
                      itemData.map((e, i) => {
                        if (inputValue) {
                          if (
                            e.itemName.includes(inputValue) ||
                            e.itemCategory.includes(inputValue)
                          ) {
                            return RenderAllData(e);
                          }
                        } else {
                          return RenderAllData(e);
                        }
                      })
                    );
                  }
                })}
            </View>
          </View>
        ) : mainCategory.deals ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View
              style={{
                width: '96%',
                height: '100%',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              {dealName &&
                dealName.length > 0 &&
                dealName.map((e, i) => {
                  if (e.active) {
                    return (
                      dealData &&
                      dealData.length > 0 &&
                      dealData.map((value, ind) => {
                        if (e.title == value.dealName)
                          if (inputValue) {
                            if (value.dealName.includes(inputValue)) {
                              return RenderAllData(value);
                            }
                          } else {
                            return RenderAllData(value);
                          }
                      })
                    );
                  } else if (!e.active) {
                    index = index + 1;
                  }

                  if (index == dealName.length) {
                    return (
                      dealData &&
                      dealData.map((e, i) => {
                        if (inputValue) {
                          if (e.dealName.includes(inputValue)) {
                            return RenderAllData(e);
                          }
                        } else {
                          return RenderAllData(e);
                        }
                      })
                    );
                  }
                })}
            </View>
          </View>
        ) : !mainCategory.item && !mainCategory.deals ? (
          <View style={{width: '100%', alignItems: 'center'}}>
            <View
              style={{
                width: '96%',
                height: '100%',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                flexDirection: 'row',
                marginTop: 20,
              }}>
              {allCategory &&
                allCategory.length > 0 &&
                allCategory.map((e, i) => {
                  if (e.active) {
                    return (
                      allData &&
                      allData.length > 0 &&
                      allData.map((value, ind) => {
                        if (
                          value.itemCategory == e.title ||
                          value.dealName == e.title
                        ) {
                          if (inputValue) {
                            if (
                              (value.itemCategory &&
                                value.itemCategory.includes(inputValue)) ||
                              (value.itemName &&
                                value.itemName.includes(inputValue)) ||
                              (value.dealName &&
                                value.dealName.includes(inputValue))
                            ) {
                              return RenderAllData(value);
                            }
                          } else {
                            return RenderAllData(value);
                          }
                        }
                      })
                    );
                  } else if (!e.active) {
                    index = index + 1;
                  }

                  if (index == allCategory.length) {
                    return (
                      allData &&
                      allData.map((e, i) => {
                        if (inputValue) {
                          if (
                            (e.itemName && e.itemName.includes(inputValue)) ||
                            (e.dealName && e.dealName.includes(inputValue)) ||
                            (e.itemCategory &&
                              e.itemCategory.includes(inputValue))
                          ) {
                            return RenderAllData(e);
                          }
                        } else {
                          return RenderAllData(e);
                        }
                      })
                    );
                  }
                })}
            </View>
          </View>
        ) : (
          ''
        )}
      </ScrollView>
    </View>
  );
}

export default User;
