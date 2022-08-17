import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  Button,
  Dimensions,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Linking,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  RotateInDownLeft,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';
const MAX_WIDTH = Dimensions.get('window').width;
const MAX_HEIGHT = Dimensions.get('window').height;

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [repos, setRepos] = useState([]);
  const [user, setUser] = useState([]);
  const [details, setDetails] = useState({});
  const [issues, setIssues] = useState([]);
  const [repomodal, setRepoModal] = useState(false);
  const [page, setPage] = useState(0);

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  function handleSubmit(e) {
    e.preventDefault();
    searchRepos();
  }
  function searchRepos() {
    setLoading(true);
    setLoaded(false);
    axios({
      method: 'get',
      url: `https://api.github.com/users/${username}`,
    })
      .then((res) => {
        setLoaded(true);
        setUser(res.data);
      })
      .catch((e) => {
        alert('Couldnt find anything');
        setLoading(false);
        setLoaded(false);
      });
    axios({
      method: 'get',
      url: `https://api.github.com/users/${username}/repos?per_page=100`,
    }).then((res) => {
      setRepos(res.data);
    });
    axios({
      method: 'get',
      url: `https://api.github.com/users/${username}/repos?page=1&per_page=100`,
    }).then((res) => {
      setRepos(res.data);
    });
    axios({
      method: 'get',
      url: `https://api.github.com/users/${username}/repos?page=2&per_page=100`,
    }).then((res) => {
      setRepos(res.data);
      setLoaded(true);
      setLoading(false);
    });
  }
  function getDetails(repoName) {
    axios({
      method: 'get',
      url: `https://api.github.com/repos/${username}/${repoName}`,
    }).then((res) => {
      setDetails(res.data);
    });
    axios({
      method: 'get',
      url: `https://api.github.com/repos/${username}/${repoName}/issues`,
    }).then((res) => {
      setIssues(res.data);
    });
    setRepoModal(true);
  }

  function profile() {
    return (
      <Animated.View
        style={{
          width: MAX_WIDTH - 4,
          height: 220,
          backgroundColor: 'white',
          borderRadius: 13,
          marginLeft: 2,
          marginTop: 8,
          borderWidth: 1,
          elevation: 20,
          shadowColor: 'black',
          flex: 1,
        }}
        entering={ZoomIn}
        exiting={ZoomOut}>
        <Image
          source={{ uri: `${user.avatar_url}` }}
          style={{
            height: 85,
            width: 85,
            alignSelf: 'center',
            borderRadius: 13,
            marginTop: 10,
          }}
        />
        <Text
          style={{
            alignSelf: 'center',
            borderRadius: 13,
            fontWeight: 'bold',
            fontSize: 25,
          }}>
          {user.login}
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
          }}>
          <Text
            style={{
              marginLeft: 10,
              justifyText: 'flex-start',
              marginBottom: 20,
              fontSize: 20,
              width: 220,
            }}>
            Followers {user.followers}
          </Text>
          <Text
            style={{
              marginBottom: 20,
              justifyText: 'flex-end',
              fontSize: 20,
            }}>
            Following {user.following}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
          }}>
          <Text
            style={{
              marginLeft: 10,
              justifyText: 'center',
              width: 220,
              fontSize: 20,
            }}>
            Repos {user.public_repos}
          </Text>
          <Text
            style={{
              justifyText: 'center',
              justifyContent: 'flex-end',
              fontSize: 20,
            }}>
            Gists {user.public_gists}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            Linking.openURL(`https://github.com/${username}`);
          }}>
          <Text
            style={{
              fontSize: 20,

              alignSelf: 'center',
              marginBottom: 2,
            }}>
            Open In Github!
          </Text>
        </Pressable>
      </Animated.View>
    );
  }

  function renderRepo(repo) {
    return (
      <Pressable
        onPress={() => {
          getDetails(repo.name);
        }}>
        <Animated.View
          style={{
            width: MAX_WIDTH - 4,
            height: 'auto',
            backgroundColor: 'white',
            borderRadius: 13,
            justifyContent: 'center',
            marginLeft: 2,
            marginTop: 8,
            borderWidth: 1,
            elevation: 20,
            shadowColor: 'black',
            flex: 1,
            alignContent: 'center',
          }}
          key={repo.id}
          entering={ZoomIn}
          exiting={ZoomOut}>
          <Text
            style={{
              padding: 8,
              fontSize: 18,
              color: 'black',
              width: 340,
              textAlign: 'center',
              marginLeft: 15,
            }}>
            {repo.name}
          </Text>
        </Animated.View>
      </Pressable>
    );
  }
  function renderIssues(title) {
    return (
      <View
        style={{
          width: MAX_WIDTH - 4,
          height: 'auto',
          backgroundColor: 'white',
          borderRadius: 13,
          justifyContent: 'center',
          marginLeft: 2,
          marginTop: 8,
          borderWidth: 1,
          elevation: 20,
          shadowColor: 'black',
          flex: 1,
          alignContent: 'center',
        }}
        key={title.id}>
        <Text
          style={{
            padding: 8,
            fontSize: 18,
            color: 'black',
            width: 340,
            textAlign: 'center',
            marginLeft: 15,
            fontWeight: 'bold',
          }}>
          {title.title}
        </Text>
        <Text
          style={{
            marginBottom: 7,
            color: 'grey',
            fontSize: 12,
            marginTop: 1,
            marginLeft: 2,
            marginRight: 2,
            textAlign: 'left',
          }}>
          {title.body}
        </Text>
      </View>
    );
  }
  return (
    <View
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <View style={{ flexDirection: 'row' }}>
        <Pressable onPress={()=>{setLoaded(false); setLoading(false); setUsername("")}}>
        <View
          style={{
            width: (MAX_WIDTH - 4) / 2,
            height: 'auto',
            backgroundColor: 'white',
            borderRadius: 13,
            justifyContent: 'center',
            marginLeft: 2,
            marginTop: 8,
            borderWidth: 1,
            elevation: 20,
            shadowColor: 'black',
            alignContent: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              borderRadius: 13,
              fontSize: 20,
              marginTop: 3,
            }}>
            Back
          </Text>
        </View>
        </Pressable>
        <Pressable>
        <View
          style={{
            width: (MAX_WIDTH - 4) / 2,
            height: 'auto',
            backgroundColor: 'white',
            borderRadius: 13,
            justifyContent: 'center',
            marginLeft: 2,
            marginTop: 8,
            borderWidth: 1,
            elevation: 20,
            shadowColor: 'black',
            alignContent: 'center',
          }}>
          <Text
            style={{
              alignSelf: 'center',
              borderRadius: 13,
              fontSize: 20,
              marginTop: 3,
            }}>
            Profile
          </Text>
        </View>
      </Pressable>
      </View>
      <View
        style={{
          width: MAX_WIDTH - 4,
          height: 50,
          marginTop: 5,
          backgroundColor: 'white',
          borderRadius: 13,
          justifyContent: 'center',
          marginLeft: 2,
          borderWidth: 1,
          flexDirection: 'row',
          elevation: 20,
          shadowColor: 'black',
        }}>
        <Modal visible={repomodal}>
          <View
            style={{
              height: MAX_HEIGHT,
            }}>
            <View
              style={{
                width: MAX_WIDTH - 4,
                height: 'auto',
                backgroundColor: 'white',
                borderRadius: 13,
                marginLeft: 2,
                marginTop: 8,
                borderWidth: 1,
                elevation: 20,
                shadowColor: 'black',
              }}>
              <Text
                style={{
                  alignSelf: 'center',
                  borderRadius: 13,
                  fontWeight: 'bold',
                  fontSize: 25,
                  marginTop: 5,
                }}>
                {details.name}
              </Text>
            </View>
            <View
              style={{
                width: MAX_WIDTH - 4,
                height: 130,
                backgroundColor: 'white',
                borderRadius: 13,
                marginLeft: 2,
                marginTop: 8,
                borderWidth: 1,
                elevation: 20,
                shadowColor: 'black',
              }}>
              <View
                style={{
                  marginTop: 10,
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    justifyText: 'flex-start',
                    marginBottom: 20,
                    fontSize: 20,
                    width: 220,
                  }}>
                  Lang: {details.language}
                </Text>
                <Text
                  style={{
                    justifyText: 'flex-end',
                    fontSize: 20,
                  }}>
                  Watching: {details.watchers_count}
                </Text>
              </View>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    marginLeft: 10,
                    justifyText: 'center',
                    width: 220,
                    fontSize: 20,
                  }}>
                  Stars: {details.stargazers_count}
                </Text>
                <Text
                  style={{
                    justifyText: 'center',
                    fontSize: 20,
                  }}>
                  Forks: {details.forks}
                </Text>
              </View>
              <Pressable
                onPress={() => {
                  Linking.openURL(
                    `https://github.com/${username}/${details.name}`
                  );
                }}>
                <Text
                  style={{
                    fontSize: 20,
                    alignSelf: 'center',
                    marginBottom: 2,
                  }}>
                  Open In Github!
                </Text>
              </Pressable>
            </View>
            <View
              style={{
                width: MAX_WIDTH - 4,
                height: 50,
                backgroundColor: 'white',
                borderRadius: 13,
                marginLeft: 2,
                marginTop: 8,
                borderWidth: 1,
                elevation: 20,
                shadowColor: 'black',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  marginBottom: 2,
                }}>
                Issues:
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <ScrollView>{issues.map(renderIssues)}</ScrollView>
            </View>
            <Pressable
              onPress={() => {
                setRepoModal(false);
              }}>
              <View
                style={{
                  width: MAX_WIDTH - 4,
                  height: 50,
                  backgroundColor: 'white',
                  borderRadius: 13,
                  marginLeft: 2,
                  marginTop: 8,
                  borderWidth: 1,
                  elevation: 20,
                  shadowColor: 'black',
                  marginBottom: 2,
                }}>
                <Text
                  style={{
                    alignSelf: 'center',
                    borderRadius: 13,
                    fontWeight: 'bold',
                    fontSize: 20,
                    marginTop: 5,
                  }}>
                  Close
                </Text>
              </View>
            </Pressable>
          </View>
        </Modal>
        <TextInput
          placeholder="Search A Github Username"
          value={username}
          onChangeText={setUsername}
          onSubmitEditing={handleSubmit}
          style={{
            padding: 8,
            fontSize: 18,
            color: 'black',
            width: 340,
          }}
          textAlign={'center'}></TextInput>
      </View>

      <ScrollView Vertical style={{endFillColor:'black'}}>
        <View>{loaded ? profile() : () => {}}</View>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {loaded ? repos.map(renderRepo) : () => {}}
        </View>
        <View>
          {loading ? (
            <Image
              style={{
                marginTop: 50,
                alignSelf: 'center',
                justifySelf: 'center',
                width:50,
                height:50,
              }}
              source={require('./loading.gif')}
            />
          ) : (
            () => {}
          )}
        </View>
      </ScrollView>
    </View>
  );
}
function InputWithLabel(props) {
  const {
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    onSubmitEditing,
  } = props;

  return (
    <View>
      <Text style={{ padding: 8, fontSize: 18, color: 'black' }}>{label}</Text>
      <TextInput
        style={{ padding: 8, fontSize: 18, color: 'black' }}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        onSubmitEditing={onSubmitEditing}></TextInput>
    </View>
  );
}

export default App;
