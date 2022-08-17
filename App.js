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
} from 'react-native';

const MAX_WIDTH = Dimensions.get('window').width;
const MAX_HEIGHT = Dimensions.get('window').height;

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [repos, setRepos] = useState([]);
  const [user, setUser] = useState([]);
  const [details, setDetails] = useState({});

  function handleSubmit(e) {
    e.preventDefault();
    searchRepos();
  }
  function searchRepos() {
    setLoading(true);
    axios({
      method: 'get',
      url: `https://api.github.com/users/${username}`,
    })
      .then((res) => {
        setLoaded(true)
        setUser(res.data);
      })
      .catch((e) => {
        alert('Couldnt find anything');
        setLoading(false);
        setLoaded(false)
      });
      axios({
      method: 'get',
      url: `https://api.github.com/users/${username}/repos`,
    })
      .then((res) => {
        setLoading(false);
        setRepos(res.data);
      });
      
  }


  function getDetails(repoName) {
    axios({
      method: 'get',
      url: `https://api.github.com/repos/${username}/${repoName}`,
    }).then((res) => {
      setDetails(res.data);
    });
  }
  function searchico() {
    return (
      <Image
        source={require('./icons8-search.gif')}
        style={{ width: 35, height: 35, marginTop: 7 }}
      />
    );
  }
  function searchinggif() {
    return (
      <Image
        source={require('./icons8-search-120.png')}
        style={{ width: 35, height: 35, marginTop: 7 }}
      />
    );
  }

  
  function profile(){
    return (
          <View
          style={{
            width: MAX_WIDTH - 4,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 13,
            justifyContent: 'center',
            marginLeft: 2,
            marginTop: 8,
            borderWidth: 1,
            elevation: 20,
            shadowColor: 'black',
            flex: 1,
            alignContent:'center'
          }}/>

    );
  }
   function notExist() {
    return (
        <View
          style={{
            width: MAX_WIDTH - 4,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 13,
            justifyContent: 'center',
            marginLeft: 2,
            marginTop: 8,
            borderWidth: 1,
            elevation: 20,
            shadowColor: 'red',
            flex: 1,
            alignContent:'center',
          }}>
          <Text
            style={{
              padding: 8,
              fontSize: 18,
              color: 'black',
              width: 340,
              textAlign: 'center',
              marginLeft:15
            }}>
          This user does not exist!
          </Text>
        </View>
    );
  }
  function renderRepo(repo) {
    return (
      <Pressable
        onPress={() => {
          getDetails(repo.name);
        }}>
        <View
          style={{
            width: MAX_WIDTH - 4,
            height: 50,
            backgroundColor: 'white',
            borderRadius: 13,
            justifyContent: 'center',
            marginLeft: 2,
            marginTop: 8,
            borderWidth: 1,
            elevation: 20,
            shadowColor: 'black',
            flex: 1,
            alignContent:'center'
          }}
          key={repo.id}>
          <Text
            style={{
              padding: 8,
              fontSize: 18,
              color: 'black',
              width: 340,
              textAlign: 'center',
              marginLeft:15
            }}>
            {repo.name}
          </Text>
        </View>
      </Pressable>
    );
  }
  return (
    <View
      style={{
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
      }}>
      <Text style={{ color: 'black' }}>{details.name}</Text>
      <View
        style={{
          width: MAX_WIDTH - 4,
          height: 50,
          backgroundColor: 'white',
          borderRadius: 13,
          justifyContent: 'center',
          marginLeft: 2,
          borderWidth: 1,
          flexDirection: 'row',
          elevation: 20,
          shadowColor: '#52006A',
        }}>
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
            marginLeft: -15,
          }}></TextInput>
        <Pressable onPress={handleSubmit}>
          {loading ? searchico() : searchinggif()}
        </Pressable>
      </View>
  
      <ScrollView Vertical>
        <View>{loaded ?profile():()=>{}}</View>
        <View>{loaded?repos.map(renderRepo):()=>{}}</View>
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
