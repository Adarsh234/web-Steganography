import image1 from '../../assets/image/stegano1.jpg'
import image2 from '../../assets/image/stegano2.jpg'
import image3 from '../../assets/image/stegano3.jpg'


const Footer = ()  => {
    return (
        <div class="steganography-images-container">
            <div><h3>Click the picture for more cyber security content</h3></div>
            <a href="https://www.securityweek.com/" target="_blank" class="a1"><img src={image1} alt="Steganography Example 1" class="steganography-image"/></a>
            <a href="https://thehackernews.com/" target="_blank" class="a1"><img src={image2} alt="Steganography Example 2" class="steganography-image"/></a>
            <a href="https://securityledger.com/" target="_blank" class="a1"><img src={image3} alt="Steganography Example 3" class="steganography-image"/></a>
        </div>
    )
}


export default Footer