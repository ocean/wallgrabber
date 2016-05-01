/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  ActivityIndicatorIOS,
  Component,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Randomath from './randomath.js';
import Swiper from 'react-native-swiper';

const NUM_WALLPAPERS = 5;

class wallgrabber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true
    };
  }

  fetchWallsJSON() {
    // console.log('Wallpapers are being fetched.');
    let url = 'http://unsplash.it/list';
    fetch(url)
      .then ( response => response.json() )
      .then ( jsonData => {
        // console.log(jsonData);
        let randomIds = Randomath.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length)
        let walls = [];
        randomIds.forEach(randomId => {
          walls.push(jsonData[randomId]);
        });
        this.setState({
          isLoading: false,
          wallsJSON: [].concat(walls)
        });
      })
      .catch ( error => console.log('Fetch error: ' + error) );
  }

  renderLoadingMessage() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicatorIOS
          animating={true}
          color={'#fff'}
          size={'small'}
          style={{margin: 15}} />
          <Text style={{color: '#fff'}}>Contacting Unsplash.it</Text>
      </View>
    );
  }

  renderResults() {
    let {wallsJSON, isLoading} = this.state;
    console.log(wallsJSON);
    if (!isLoading) {
      return (
        // <View style={styles.dataContainer}>
        <Swiper

        dot={<View style={{backgroundColor: 'rgba(25,25,25,0.4)', width: 10, height: 10, borderRadius: 10, marginLeft: 4, marginRight: 4, marginTop: 4, marginBottom: 4}} />}

        activeDot={<View style={{backgroundColor: '#000', width: 10, height: 10, borderRadius: 10, marginLeft: 4, marginRight: 4}} />}

        onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          {wallsJSON.map((wallpaper, index) => {
            return (
              <Text style={styles.data} key={index}>
                {wallpaper.id + '\n' + wallpaper.author}
              </Text>
            );
          })}
        </Swiper>
      );
    };
  }

  componentDidMount() {
    this.fetchWallsJSON();
  }

  render() {
    let {isLoading} = this.state;
    if (isLoading) {
      return this.renderLoadingMessage();
    } else {
      return this.renderResults();
    }
    // return (
    //   <View style={styles.container}>
    //     <Text style={styles.welcome}>
    //       Welcome to React Native!
    //     </Text>
    //     <Text style={styles.instructions}>
    //       To get started, edit index.ios.js
    //     </Text>
    //     <Text style={styles.instructions}>
    //       Press Cmd+R to reload,{'\n'}
    //       Cmd+D or shake for dev menu
    //     </Text>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  dataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  data: {
    fontSize: 16,
    marginTop: 150,
    textAlign: 'center',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('wallgrabber', () => wallgrabber);
