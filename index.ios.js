/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {
  AppRegistry,
  ActivityIndicatorIOS,
  Component,
  Dimensions,
  PanResponder,
  StyleSheet,
  Text,
  View
} from 'react-native';
import NetworkImage from 'react-native-image-progress';
import Progress from 'react-native-progress';
import Randomath from './randomath.js';
import Swiper from 'react-native-swiper';

const NUM_WALLPAPERS = 5;
const {height, width} = Dimensions.get('window');

class wallgrabber extends Component {
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true
    };

    this.imagePanResponder = {};
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

  handleStartShouldSetPanResponder(e, gestureState) {
    return true;
  }
  handlePanResponderGrant(e, gestureState) {
    console.log('Finger touched the image.');
  }
  handlePanResponderEnd(e, gestureState) {
    console.log('Finger lifted off the image.');
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
          dot={<View style={{backgroundColor: 'rgba(200,200,200,0.4)', width: 10, height: 10, borderRadius: 10, marginLeft: 4, marginRight: 4, marginTop: 4, marginBottom: 4}} />}
          activeDot={<View style={{backgroundColor: '#fff', width: 10, height: 10, borderRadius: 10, marginLeft: 4, marginRight: 4}} />}
          loop={false}
          onMomentumScrollEnd={this.onMomentumScrollEnd}
        >
          {wallsJSON.map((wallpaper, index) => {
            console.log(`https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`);
            return (
              // <Text style={styles.data} key={index}>
              //   {wallpaper.id + '\n' + wallpaper.author}
              // </Text>
              <View key={index}>
                <NetworkImage
                  source={{ uri: `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}` }}
                  indicator={Progress.Circle}
                  style={styles.wallpaperImage}
                  indicatorProps={{
                    color: 'rgba(255,255,255)',
                    size: 60,
                    thickness: 7
                  }}
                  {...this.imagePanResponder.panHandlers}>
                  <Text style={styles.label}>Photo by</Text>
                  <Text style={styles.label_author}>{wallpaper.author}</Text>
                </NetworkImage>
              </View>
            );
          })}
        </Swiper>
      );
    };
  }

  componentWillMount() {
    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });
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
  // dataContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: '#fff',
  // },
  // data: {
  //   fontSize: 16,
  //   marginTop: 150,
  //   textAlign: 'center',
  // },
  wallpaperImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000',
  },
  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 12,
    fontStyle: 'italic',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width/2
  },
  label_author: {
    position: 'absolute',
    color: '#fff',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    width: width/2
  },
  instructions: {
    textAlign: 'center',
    color: '#333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('wallgrabber', () => wallgrabber);
