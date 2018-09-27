import React, { Component } from 'react';
import { connect } from 'react-redux';
import { YOUTUBE_API } from '../../../../../config/env';
import ApiTraining from '../../../../api/training';
import {
    Container,
    Content,
    List,
    Item,
    CardItem,
    View
} from 'native-base';

import { WebView, ScrollView } from 'react-native'

import {
    handlerErrorResponse
} from '../../../../service/error_handler';
import {
    changeHeaderTitle,
    changeSideBarInivisble
} from '../../../../actions/shared';
import BaseComponent from '../../BaseComponent';
/* import YouTube, {
    YouTubeStandaloneIOS,
    YouTubeStandaloneAndroid
} from 'react-native-youtube'; */
import NavigationService from '../../../../service/NavigationService';

class Main extends BaseComponent {

    constructor(props) {
        super(props);
        this.state = {
            videos: [],
        };
        // this.refreshData();

    };

    componentDidMount() {
        console.log("Component did mount");
        return this.refreshData();
    };


    /* componentDidMount() {
        this.refreshData();
        this.subs = [
            this.props.navigation.addListener("didFocus", () => {
                this.props.changeHeaderTitle("Training");
                this.props.visableSideBar();
                this.refreshData();
                console.log("Train main mounted");
            }),
            this.props.navigation.addListener("willBlur", () => { })
        ];
    }
 */

    refreshData() {
        ApiTraining.getVideos()
            .then(response => {
                this.setState({
                    videos: [...this.state.videos, ...response.data]
                });
            })
            .catch(err => {
                console.log(JSON.stringify(err, null, 3));
            });
    };

    componentWillUnmount() {
        this.subs.forEach(sub => sub.remove());
    };

    render() {
        console.log(JSON.stringify(this.state.videos, null, 3));
        return (
            <Container>
                <Content padder>
                    <List>
                        {
                            (this.state.videos.length > 0) ? this.state.videos.map(video => {
                                return <CardItem>
                                    <WebView
                                        style={{
                                            flex: 1,
                                            height: 180,
                                        }}
                                        startInLoadingState
                                        scalesPageToFit
                                        javaScriptEnabled
                                        source={{
                                            uri: `https://www.youtube.com/embed/${video.url}?controls=1&showinfo=1`
                                        }}
                                    />
                                </CardItem>
                            }) : null
                        }
                    </List>
                    {/* <WebView
                        style={{
                            height: 150
                        }}
                        startInLoadingState
                        scalesPageToFit
                        javaScriptEnabled
                        source={{ uri: `https://www.youtube.com/embed/s7L2PVdrb_8?controls=0&showinfo=0` }}
                    /> */}
                </Content>
            </Container >
        );
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeHeaderTitle: (headerTitle) => {
            dispatch(changeHeaderTitle(headerTitle))
        },
        visableSideBar: () => {
            dispatch(changeSideBarInivisble(false))
        }
    }
}

export default connect(undefined, mapDispatchToProps)(Main);
{/*

    <ScrollView
                        style={styles.container}
                        onLayout={({
                            nativeEvent: {
                                layout: { width }
                            },
                        }) => {
                            if (!this.state.containerWidth)
                                this.setState({ containerMounted: true });
                            if (this.state.containerWidth !== width)
                                this.setState({ containerWidth: width });
                        }}>
                        {this.state.containerMounted && (
                            <YouTube
                                ref={component => {
                                    this._youTubeRef = component;
                                }}
                                // You must have an API Key for the player to load in Android
                                apiKey="AIzaSyCXOe0WQTkSasEW2PX4bkIS_oyhQ1OO2nk"
                                // Un-comment one of videoId / videoIds / playlist.
                                // You can also edit these props while Hot-Loading in development mode to see how
                                // it affects the loaded native module
                                videoId="ncw4ISEU5ik"
                                // videoIds={['HcXNPI-IPPM', 'XXlZfc1TrD0', 'czcjU1w-c6k', 'uMK0prafzw0']}
                                // playlistId="PLF797E961509B4EB5"
                                play={this.state.isPlaying}
                                loop={this.state.isLooping}
                                fullscreen={this.state.fullscreen}
                                style={{width:300, height:150}}
                                autopla={false}
                                controls={1}
                                style={[
                                    {
                                        height: PixelRatio.roundToNearestPixel(
                                            this.state.containerWidth / (16 / 9)
                                        ),
                                    },
                                    styles.player,
                                ]}
                                onError={e => this.setState({ error: e.error })}
                                onReady={e => this.setState({ isReady: true })}
                                onChangeState={e => this.setState({ status: e.state })}
                                onChangeQuality={e => this.setState({ quality: e.quality })}
                                onChangeFullscreen={e =>
                                    this.setState({ fullscreen: e.isFullscreen })
                                }
                                onProgress={e =>
                                    this.setState({
                                        duration: e.duration,
                                        currentTime: e.currentTime,
                                    })
                                }
                            />
                        )}

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.setState(s => ({ isPlaying: !s.isPlaying }))}>
                                <Text style={styles.buttonText}>
                                    {this.state.status == 'playing' ? 'Pause' : 'Play'}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this.setState(s => ({ isLooping: !s.isLooping }))}>
                                <Text style={styles.buttonText}>
                                    {this.state.isLooping ? 'Looping' : 'Not Looping'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    this._youTubeRef && this._youTubeRef.previousVideo()
                                }>
                                <Text style={styles.buttonText}>Previous Video</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this._youTubeRef && this._youTubeRef.nextVideo()}>
                                <Text style={styles.buttonText}>Next Video</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this._youTubeRef && this._youTubeRef.seekTo(15)}>
                                <Text style={styles.buttonText}>15 Seconds</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this._youTubeRef && this._youTubeRef.seekTo(2 * 60)}>
                                <Text style={styles.buttonText}>2 Minutes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    this._youTubeRef && this._youTubeRef.seekTo(15 * 60)
                                }>
                                <Text style={styles.buttonText}>15 Minutes</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this._youTubeRef && this._youTubeRef.seekTo(15)}>
                                <Text style={styles.buttonText}>15 Seconds</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => this._youTubeRef && this._youTubeRef.seekTo(2 * 60)}>
                                <Text style={styles.buttonText}>2 Minutes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    this._youTubeRef && this._youTubeRef.seekTo(15 * 60)
                                }>
                                <Text style={styles.buttonText}>15 Minutes</Text>
                            </TouchableOpacity>
                        </View>

                        {this._youTubeRef &&
                            this._youTubeRef.props.videoIds &&
                            Array.isArray(this._youTubeRef.props.videoIds) && (
                                <View style={styles.buttonGroup}>
                                    {this._youTubeRef.props.videoIds.map((videoId, i) => (
                                        <TouchableOpacity
                                            key={i}
                                            style={styles.button}
                                            onPress={() =>
                                                this._youTubeRef && this._youTubeRef.playVideoAt(i)
                                            }>
                                            <Text
                                                style={[
                                                    styles.buttonText,
                                                    styles.buttonTextSmall,
                                                ]}>{`Video ${i}`}</Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            )}

                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() =>
                                    this._youTubeRef &&
                                    this._youTubeRef
                                        .videosIndex()
                                        .then(index => this.setState({ videosIndex: index }))
                                        .catch(errorMessage => this.setState({ error: errorMessage }))
                                }>
                                <Text style={styles.buttonText}>
                                    Get Videos Index: {this.state.videosIndex}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {!this.state.fullscreen && (
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => this.setState({ fullscreen: true })}>
                                    <Text style={styles.buttonText}>Set Fullscreen</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {Platform.OS === 'android' && (
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        this._youTubeRef
                                            ? this._youTubeRef
                                                .currentTime()
                                                .then(currentTime => this.setState({ currentTime }))
                                                .catch(errorMessage =>
                                                    this.setState({ error: errorMessage })
                                                )
                                            : this._youTubeRef
                                                .duration()
                                                .then(duration => this.setState({ duration }))
                                                .catch(errorMessage =>
                                                    this.setState({ error: errorMessage })
                                                )
                                    }>
                                    <Text style={styles.buttonText}>
                                        Update Progress & Duration (Android)
              </Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        {Platform.OS === 'ios' &&
                            YouTubeStandaloneIOS && (
                                <View style={styles.buttonGroup}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() =>
                                            YouTubeStandaloneIOS.playVideo('KVZ-P-ZI6W4')
                                                .then(() => console.log('iOS Standalone Player Finished'))
                                                .catch(errorMessage =>
                                                    this.setState({ error: errorMessage })
                                                )
                                        }>
                                        <Text style={styles.buttonText}>Launch Standalone Player</Text>
                                    </TouchableOpacity>
                                </View>
                            )}

                        {Platform.OS === 'android' &&
                            YouTubeStandaloneAndroid && (
                                <View style={styles.buttonGroup}>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() =>
                                            YouTubeStandaloneAndroid.playVideo({
                                                apiKey: "AIzaSyCXOe0WQTkSasEW2PX4bkIS_oyhQ1OO2nk",
                                                videoId: 'KVZ-P-ZI6W4',
                                                autoplay: true,
                                                lightboxMode: false,
                                                startTime: 124.5,
                                            })
                                                .then(() =>
                                                    console.log('Android Standalone Player Finished')
                                                )
                                                .catch(errorMessage =>
                                                    this.setState({ error: errorMessage })
                                                )
                                        }>
                                        <Text style={styles.buttonText}>Standalone: One Video</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() =>
                                            YouTubeStandaloneAndroid.playVideos({
                                                apiKey: 'AIzaSyCXOe0WQTkSasEW2PX4bkIS_oyhQ1OO2nk',
                                                videoIds: [
                                                    'HcXNPI-IPPM',
                                                    'XXlZfc1TrD0',
                                                    'czcjU1w-c6k',
                                                    'uMK0prafzw0',
                                                ],
                                                autoplay: false,
                                                lightboxMode: true,
                                                startIndex: 1,
                                                startTime: 99.5,
                                            })
                                                .then(() =>
                                                    console.log('Android Standalone Player Finished')
                                                )
                                                .catch(errorMessage =>
                                                    this.setState({ error: errorMessage })
                                                )
                                        }>
                                        <Text style={styles.buttonText}>Videos</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.button}
                                        onPress={() =>
                                            YouTubeStandaloneAndroid.playPlaylist({
                                                apiKey: 'AIzaSyCXOe0WQTkSasEW2PX4bkIS_oyhQ1OO2nk',
                                                playlistId: 'PLF797E961509B4EB5',
                                                autoplay: false,
                                                lightboxMode: false,
                                                startIndex: 2,
                                                startTime: 100.5,
                                            })
                                                .then(() =>
                                                    console.log('Android Standalone Player Finished')
                                                )
                                                .catch(errorMessage =>
                                                    this.setState({ error: errorMessage })
                                                )
                                        }>
                                        <Text style={styles.buttonText}>Playlist</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
\
                        {Platform.OS === 'ios' && (
                            <View style={styles.buttonGroup}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() =>
                                        this._youTubeRef && this._youTubeRef.reloadIframe()
                                    }>
                                    <Text style={styles.buttonText}>Reload iFrame (iOS)</Text>
                                </TouchableOpacity>
                            </View>
                        )}

                        <Text style={styles.instructions}>
                            {this.state.isReady ? 'Player is ready' : 'Player setting up...'}
                        </Text>
                        <Text style={styles.instructions}>Status: {this.state.status}</Text>
                        <Text style={styles.instructions}>Quality: {this.state.quality}</Text>

                        <Text style={styles.instructions}>
                            Progress: {Math.trunc(this.state.currentTime)}s ({Math.trunc(
                                this.state.duration / 60
                            )}:{Math.trunc(this.state.duration % 60)}s)
          {Platform.OS !== 'ios' && (
                                <Text> (Click Update Progress & Duration)</Text>
                            )}
                        </Text>

                        <Text style={styles.instructions}>
                            {this.state.error ? 'Error: ' + this.state.error : ''}
                        </Text>
                    </ScrollView>
*/}